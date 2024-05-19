use std::{error::Error, sync::Arc};

use axum::{routing::get, Router};

use sqlx::PgPool;
use tokio::sync::broadcast;

use crate::LiveState;

mod cors;
mod health;
mod history;
pub mod live;
mod recap;

pub struct AppState {
    tx: broadcast::Sender<live::LiveEvent>,
    state: LiveState,
    db: PgPool,
}

fn addr() -> String {
    std::env::var("BACKEND_ADDRESS").unwrap_or("0.0.0.0:4000".to_string())
}

pub async fn init(
    db: PgPool,
    tx: broadcast::Sender<live::LiveEvent>,
    state: LiveState,
) -> Result<(), Box<dyn Error>> {
    let cors = cors::init();

    let app_state = Arc::new(AppState { tx, state, db });

    let app = Router::new()
        .route("/api/sse", get(live::sse_handler))
        .route("/api/range-buffer", get(recap::range))
        .route("/api/history/driver/:id", get(history::get_driver))
        .route("/api/health", get(health::check))
        .layer(cors)
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind(addr())
        .await
        .expect("failed to bind to port");

    axum::serve(listener, app)
        .await
        .expect("failed to serve http server");

    Ok(())
}
