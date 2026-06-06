use anyhow::Error;
use shared::tracing_subscriber;
use tokio::sync::broadcast;
use tracing::warn;

use crate::services::state_service::StateService;

mod f1;
mod http_server;
mod services {
    pub mod state_service;
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber();

    let state_service = StateService::new();

    let (sender, _reciver) = broadcast::channel::<String>(16);

    {
        let state_service = state_service.clone();
        let sender = sender.clone();
        tokio::spawn(async move {
            loop {
                match f1::ingest_f1(state_service.clone(), sender.clone()).await {
                    Ok(_) => {}
                    Err(err) => {
                        warn!(?err, "ingest_f1 method returned error");
                    }
                };

                warn!("ingest_f1 method returned, possible session change, restarting...");
                tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
            }
        });
    }

    http_server::start(state_service, sender).await?;

    Ok(())
}
