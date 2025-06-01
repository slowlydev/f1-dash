use std::{
    env,
    net::SocketAddr,
    sync::{Arc, Mutex},
};

use axum::{
    http::{HeaderValue, Method},
    routing::get,
    Router,
};
use compression::compress_sse;
use dotenvy::dotenv;
use serde_json::Value;
use tokio::{net::TcpListener, sync::broadcast};
use tower_http::cors::CorsLayer;
use tracing::info;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

use client::message::Message;

mod compression;
mod server {
    pub mod drivers;
    pub mod health;
    pub mod live;
}

pub struct AppState {
    tx: broadcast::Sender<Message>,
    state: Arc<Mutex<Value>>,
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let _ = dotenv();

    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::from_default_env())
        .init();

    let default_addr = "0.0.0.0:4000".to_string();
    let addr = env::var("LIVE_ADDRESS").unwrap_or(default_addr);

    info!(?addr, "starting live service");

    let stream = client::manage();
    let (tx, rx) = client::broadcast(stream);
    let state = client::keep_state(rx);

    let cors = cors_layer()?;

    let app_state = Arc::new(AppState { tx, state });

    let app = Router::new()
        .route("/api/health", get(server::health::check))
        .route("/api/sse", get(server::live::sse_handler))
        .route("/api/drivers", get(server::drivers::get_drivers))
        .layer(cors)
        .layer(axum::middleware::from_fn(compress_sse))
        .with_state(app_state)
        .into_make_service_with_connect_info::<SocketAddr>();

    let listener = TcpListener::bind(addr).await?;

    axum::serve(listener, app).await?;

    Ok(())
}

pub fn cors_layer() -> Result<CorsLayer, anyhow::Error> {
    let origin = env::var("ORIGIN")?; // origins string split by semicolumn

    let origins = origin
        .split(';')
        .filter_map(|o| HeaderValue::from_str(o).ok())
        .collect::<Vec<HeaderValue>>();

    Ok(CorsLayer::new()
        .allow_origin(origins)
        .allow_methods([Method::GET, Method::CONNECT]))
}
