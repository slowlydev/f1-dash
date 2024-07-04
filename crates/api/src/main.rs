use axum::{routing::get, Router};
use tokio::net::TcpListener;
use tracing::info;
use tracing::level_filters::LevelFilter;

use env;

mod endpoints {
    pub(crate) mod health;
    pub(crate) mod schedule;
}

#[tokio::main]
async fn main() {
    env::init();
    init_logs();

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

fn init_logs() {
    let env_filter = tracing_subscriber::EnvFilter::builder()
        .with_default_directive(LevelFilter::INFO.into())
        .with_env_var("RUST_LOG")
        .from_env_lossy();

    tracing_subscriber::fmt().with_env_filter(env_filter).init();
}
