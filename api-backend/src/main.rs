use axum::{routing::get, Router};
use tokio::net::TcpListener;
use tracing::info;

mod env;
mod log;
mod endpoints {
    pub mod health;
    pub mod schedule;
}

#[tokio::main]
async fn main() {
    env::init();
    log::init();

    let app = Router::new()
        .route("/api/schedule", get(endpoints::schedule::get))
        .route("/api/schedule/next", get(endpoints::schedule::get_next))
        .route("/api/health", get(endpoints::health::check));

    let default_addr = "0.0.0.0:5000".to_string();
    let addr = std::env::var("BACKEND_ADDRESS").unwrap_or(default_addr);

    info!("running on {}", addr);

    let listener = TcpListener::bind(addr).await.expect("failed to bind");

    axum::serve(listener, app)
        .await
        .expect("failed to setup server");
}
