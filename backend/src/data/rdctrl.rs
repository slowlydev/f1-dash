use std::collections::HashMap;

use serde::Serialize;
use serde_json::Value;
use sqlx::PgPool;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};

use crate::{
    broadcast,
    client::parser::ParsedMessage,
    db::{self, history::History},
};

use self::transformer::{get_table_update_name, TableUpdate};

pub mod keeper;
pub mod transformer;

// realtime data control
// receives messages from client and transforms them ASAP
// sends initial state to odctrl
// writes them into the DB

pub async fn init(
    pool: PgPool,
    mut client_rx: UnboundedReceiver<ParsedMessage>,
    broadcast_tx: UnboundedSender<broadcast::Event>,
    initial_tx: UnboundedSender<Value>,
) {
    while let Some(message) = client_rx.recv().await {
        match message {
            ParsedMessage::Empty => (),
            ParsedMessage::Replay(state) => {
                // transform
                let updates = transformer::parse_initial(state.clone());

                // insert into db
                keeper::keep(pool.clone(), updates.clone()).await;

                // send initial
                let _ = initial_tx.send(state.clone());

                // format for outgoing traffic
                let server_message = create_server_message(pool.clone(), updates).await;

                // send to broadcast
                if let Ok(server_message) = serde_json::to_value(server_message) {
                    let _ = broadcast_tx.send(broadcast::Event::OutRealtime(server_message));
                }
            }
            ParsedMessage::Updates(updates) => {
                // transform
                let updates = transformer::parse_updates(updates);

                // insert into db
                keeper::keep(pool.clone(), updates.clone()).await;

                // format for outgoing traffic
                let server_message = create_server_message(pool.clone(), updates).await;

                // send to broadcast
                if let Ok(server_message) = serde_json::to_value(server_message) {
                    let _ = broadcast_tx.send(broadcast::Event::OutRealtime(server_message));
                }
            }
        };
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
struct ServerMessage {
    pub updates: HashMap<String, Vec<TableUpdate>>,
    pub history: HashMap<String, History>,
}

async fn create_server_message(pool: PgPool, updates: Vec<TableUpdate>) -> ServerMessage {
    let mut updates_map: HashMap<String, Vec<TableUpdate>> = HashMap::new();

    for update in updates {
        let name = get_table_update_name(&update);
        if updates_map.contains_key(&name) {
            updates_map.get_mut(&name).unwrap().push(update);
        } else {
            updates_map.insert(name, vec![update]);
        }
    }

    let lap_time = db::history::driver_lap_time(pool.clone()).await;
    let leader_gap = db::history::driver_leader_gap(pool.clone()).await;
    let ahead_gap = db::history::driver_ahead_gap(pool.clone()).await;
    let sectors = db::history::driver_sector(pool.clone()).await;
    let weather = db::history::weather(pool).await;

    let mut history_map: HashMap<String, History> = HashMap::new();

    if let Some(lap_time) = lap_time {
        history_map.insert("lap_time".to_string(), History::LapTime(lap_time));
    }
    if let Some(leader_gap) = leader_gap {
        history_map.insert("leader_gap".to_string(), History::LeaderGap(leader_gap));
    }
    if let Some(ahead_gap) = ahead_gap {
        history_map.insert("ahead_gap".to_string(), History::AheadGap(ahead_gap));
    }
    if let Some(sectors) = sectors {
        history_map.insert("sectors".to_string(), History::Sectors(sectors));
    }
    if let Some(weather) = weather {
        history_map.insert("weather".to_string(), History::Weather(weather));
    }

    ServerMessage {
        updates: updates_map,
        history: history_map,
    }
}
