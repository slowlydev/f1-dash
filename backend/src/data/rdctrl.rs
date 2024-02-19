use serde_json::Value;
use sqlx::PgPool;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};

use crate::{broadcast, client::parser::ParsedMessage};

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

                // send to broadcast
                let _ = broadcast_tx.send(broadcast::Event::OutInitial(state));
            }
            ParsedMessage::Updates(updates) => {
                // transform
                let updates = transformer::parse_updates(updates);

                // insert into db
                keeper::keep(pool.clone(), updates.clone()).await;

                // format for outgoing traffic

                // send to broadcast
                // let _ = broadcast_tx.send(broadcast::Event::OutUpdate());
            }
        };
    }
}
