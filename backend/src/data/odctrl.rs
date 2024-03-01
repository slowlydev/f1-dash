use chrono::{DateTime, Utc};
use sqlx::PgPool;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tracing::{debug, info, warn};

use crate::broadcast;

pub mod merge;
pub mod query;
pub mod recon;

// old data control
// handles requests for older updates
// handles reconstruction of initial states for new connections

pub enum Request {
    Initial(u32),
    DelayedInitial(u32, DateTime<Utc>),
    DelayedUpdates(u32, DateTime<Utc>, DateTime<Utc>),
}

pub async fn init(
    pool: PgPool,
    mut odctrl_rx: UnboundedReceiver<Request>,
    broadcast_tx: UnboundedSender<broadcast::Event>,
) {
    while let Some(request) = odctrl_rx.recv().await {
        match request {
            Request::Initial(id) => {
                let broadcast_tx = broadcast_tx.clone();
                let pool = pool.clone();

                tokio::spawn(async move {
                    info!("creating initial message from db");
                    let initial = recon::initial(pool, chrono::Utc::now()).await;

                    match initial {
                        Ok(initial) => {
                            info!("sending reconstructed initial state");
                            let _ = broadcast_tx.send(broadcast::Event::OutInitial(id, initial));
                        }
                        Err(_) => {
                            warn!("failed to reconstruct late initial");
                            // let _ = broadcast_tx.send(broadcast::Event::Quit(id));
                        }
                    }
                });
            }
            Request::DelayedInitial(id, timestamp) => {
                let broadcast_tx = broadcast_tx.clone();
                let pool = pool.clone();

                tokio::spawn(async move {
                    debug!("recreating delayed state from db");
                    let initial = recon::initial(pool, timestamp).await;

                    match initial {
                        Ok(initial) => {
                            info!("sending reconstructed delayed state");
                            let _ =
                                broadcast_tx.send(broadcast::Event::OutReconstruct(id, initial));
                        }
                        Err(_) => {
                            warn!("failed to reconstruct delayed state");
                        }
                    }
                });
            }
            Request::DelayedUpdates(id, start, end) => {
                let broadcast_tx = broadcast_tx.clone();
                let pool = pool.clone();

                tokio::spawn(async move {
                    debug!("querying delayed updates from db");
                    let updates = query::updates(pool, start, end).await;

                    match updates {
                        Ok(updates) => {
                            info!("sending delayed updates");
                            let _ = broadcast_tx
                                .send(broadcast::Event::OutRequestedUpdates(id, updates));
                        }
                        Err(_) => {
                            warn!("failed to query delayed updates");
                        }
                    }
                });
            }
        }
    }
}
