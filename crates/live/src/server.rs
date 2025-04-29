use std::{error::Error, net::SocketAddr, sync::Arc};

use axum::{routing::get, Router};
use tokio::sync::broadcast;

use tracing::info;

use crate::{LiveEvent, LiveState};

mod cors;
mod drivers;
mod health;
pub mod live;

pub struct AppState {
    tx: broadcast::Sender<LiveEvent>,
    state: LiveState,
}

fn addr() -> String {
    std::env::var("LIVE_BACKEND_ADDRESS").unwrap_or("0.0.0.0:4000".to_string())
}

pub async fn init(
    tx: broadcast::Sender<LiveEvent>,
    state: LiveState,
) -> Result<(), Box<dyn Error>> {
    let cors = cors::init();

    let app_state = Arc::new(AppState { tx, state });

    let app = Router::new()
        .route("/api/sse", get(live::sse_handler))
        .route("/api/health", get(health::check))
        .route("/api/drivers", get(drivers::get_drivers))
        .layer(cors)
        .with_state(app_state)
        .into_make_service_with_connect_info::<SocketAddr>();

    let addr = addr();

    info!("running on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind to port");

    axum::serve(listener, app)
        .await
        .expect("failed to serve http server");

    Ok(())
}
