use chrono::{DateTime, Utc};
use sqlx::PgPool;
use tokio::sync::mpsc::{Receiver, Sender};
use tracing::{debug, info, warn};

use crate::broadcast;

pub mod history;
pub mod merge;
pub mod query;
pub mod recon;

// old data control
// handles requests for older updates
// handles reconstruction of initial states for new connections

pub enum Request {
    Initial(u32),
    Reconstruct(u32, DateTime<Utc>),
    Updates(u32, DateTime<Utc>, DateTime<Utc>),
}

pub async fn init(
    pool: PgPool,
    mut odctrl_rx: Receiver<Request>,
    broadcast_tx: Sender<broadcast::Event>,
) {
    info!("starting...");

    while let Some(request) = odctrl_rx.recv().await {
        match request {
            Request::Initial(id) => {
                let broadcast_tx = broadcast_tx.clone();
                let pool = pool.clone();

                tokio::spawn(async move {
                    info!("creating initial message from db");
                    let now = chrono::Utc::now();
                    let initial = recon::initial(&pool, now).await;
                    let queries = history::queries(&pool, now).await;

                    match initial {
                        Ok(initial) => {
                            info!("sending reconstructed initial state");
                            let _ = &broadcast_tx
                                .send(broadcast::Event::OutInitial(id, initial, queries))
                                .await;
                        }
                        Err(_) => {
                            warn!("failed to reconstruct late initial");
                            // let _ = &broadcast_tx.send(broadcast::Event::Quit(id));
                        }
                    }
                });
            }
            Request::Reconstruct(id, timestamp) => {
                let broadcast_tx = broadcast_tx.clone();
                let pool = pool.clone();

                tokio::spawn(async move {
                    debug!("recreating delayed state from db");
                    let initial = recon::delayed_initial(&pool, timestamp).await;
                    let queries = history::queries(&pool, timestamp).await;

                    match initial {
                        Ok(initial) => {
                            info!("sending reconstructed delayed state");
                            let _ = broadcast_tx
                                .send(broadcast::Event::OutReconstruct(id, initial, queries))
                                .await;
                        }
                        Err(_) => {
                            warn!("failed to reconstruct delayed state");
                        }
                    }
                });
            }
            Request::Updates(id, start, end) => {
                let broadcast_tx = broadcast_tx.clone();
                let pool = pool.clone();

                tokio::spawn(async move {
                    debug!("querying delayed updates from db");
                    let updates = query::updates(pool, start, end).await;

                    match updates {
                        Ok(updates) => {
                            info!("sending delayed updates");
                            let _ = broadcast_tx
                                .send(broadcast::Event::OutRequestedUpdates(id, updates))
                                .await;
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
