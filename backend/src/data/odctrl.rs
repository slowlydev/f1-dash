use sqlx::PgPool;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tracing::info;

use crate::broadcast;

pub mod message;

// old data control
// handles requests for older updates
// handles reconstruction of initial states for new connections

pub enum Request {
    Initial(u32),
    DelayedInitial(String),
    DelayedUpdates(String),
}

pub async fn init(
    pool: PgPool,
    mut odctrl_rx: UnboundedReceiver<Request>,
    broadcast_tx: UnboundedSender<broadcast::Event>,
) {
    while let Some(request) = odctrl_rx.recv().await {
        match request {
            Request::Initial(id) => {
                info!("creating initial message from db");
                let initial_message = message::create_initial_message(pool.clone()).await;
                if let Ok(message) = serde_json::to_value(initial_message) {
                    info!("sending initial from database");
                    let _ = broadcast_tx.send(broadcast::Event::OutInitial(id, message));
                }
            }
            _ => {}
        }
    }
}
