use sqlx::PgPool;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tracing::info;

use crate::{broadcast, client};

pub mod keeper;
pub mod message;
pub mod transformer;

// realtime data control
// receives messages from client and transforms them ASAP
// sends initial state to odctrl
// writes them into the DB

pub async fn init(
    pool: PgPool,
    mut client_rx: UnboundedReceiver<client::parser::ParsedMessage>,
    broadcast_tx: UnboundedSender<broadcast::Event>,
) {
    while let Some(message) = client_rx.recv().await {
        match message {
            client::parser::ParsedMessage::Empty => (),
            client::parser::ParsedMessage::Initial(state) => {
                // transform
                let initial_updates = transformer::parse_initial(state);

                // insert into db
                tokio::spawn(keeper::keep(pool.clone(), initial_updates.clone()));

                // send to broadcast
                let message = message::create_update_message(initial_updates);
                if let Ok(message) = serde_json::to_value(message) {
                    info!("sending initial state");
                    let _ = broadcast_tx.send(broadcast::Event::OutRealtime(message));
                }
            }
            client::parser::ParsedMessage::Updates(updates) => {
                // transform
                let updates = transformer::parse_updates(updates);

                // insert into db
                tokio::spawn(keeper::keep(pool.clone(), updates.clone()));

                // send to broadcast
                let message = message::create_update_message(updates);
                if let Ok(message) = serde_json::to_value(message) {
                    let _ = broadcast_tx.send(broadcast::Event::OutRealtime(message));
                }
            }
        };
    }
}
