use axum::{routing::get, Router};
use tokio::net::TcpListener;
use tracing::info;

use env;
use log;

mod endpoints {
    pub(crate) mod health;
    pub(crate) mod schedule;
}

#[tokio::main]
async fn main() {
    env::init();
    log::init();

    let app = Router::new()
        .route("/api/schedule", get(endpoints::schedule::get))
        .route("/api/schedule/next", get(endpoints::schedule::get_next))
        .route("/api/health", get(endpoints::health::check));

    let addr = addr();

    info!("running on {}", addr);

    let listener = TcpListener::bind(addr).await.expect("failed to bind");

    axum::serve(listener, app)
        .await
        .expect("failed to setup server");
}

fn addr() -> String {
    std::env::var("API_BACKEND_ADDRESS").unwrap_or("0.0.0.0:5000".to_string())
}
