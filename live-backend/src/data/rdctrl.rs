use sqlx::PgPool;
use tokio::sync::mpsc::{Receiver, Sender};
use tracing::info;

use crate::{
    broadcast,
    client::{self},
};

pub mod keeper;
pub mod transformer;

// realtime data control
// receives messages from client and transforms them ASAP
// sends initial state to odctrl
// writes them into the DB

pub async fn init(
    pool: PgPool,
    mut client_rx: Receiver<client::parser::ParsedMessage>,
    broadcast_tx: Sender<broadcast::Event>,
) {
    info!("starting...");

    while let Some(message) = client_rx.recv().await {
        match message {
            client::parser::ParsedMessage::Empty => (),
            client::parser::ParsedMessage::Initial(mut state) => {
                // transform
                let initial = transformer::transform_map(&mut state);

                // insert into db
                tokio::spawn(keeper::save_initial(pool.clone(), initial.clone()));

                // send to broadcast
                let _ = broadcast_tx
                    .send(broadcast::Event::OutFirstInitial(initial))
                    .await;
            }
            client::parser::ParsedMessage::Updates(updates) => {
                // transform
                let mut updates = updates.clone();
                transformer::transform_updates(&mut updates);

                // insert into db
                tokio::spawn(keeper::save_updates(pool.clone(), updates.clone()));

                // send to broadcast
                let _ = broadcast_tx
                    .send(broadcast::Event::OutUpdate(updates))
                    .await;
            }
        };
    }
}
