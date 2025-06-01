use std::{env, sync::Arc};

use axum::{
    http::{HeaderValue, Method},
    routing::get,
    Router,
};
use dotenvy::dotenv;
use sqlx::PgPool;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use tracing::info;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

use timescale::init_timescaledb;

use server::{gap::get_driver_gap, health::healt_check, laptime::get_driver_laptimes};

mod server {
    pub mod gap;
    pub mod health;
    pub mod laptime;
}

pub struct AppState {
    pool: PgPool,
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let _ = dotenv();

    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::from_default_env())
        .init();

    let default_addr = "0.0.0.0:4002".to_string();
    let addr = env::var("ANALYTICS_ADDRESS").unwrap_or(default_addr);

    info!(addr, "starting analytics service");

    let pool = init_timescaledb(false).await?;

    let cors = cors_layer()?;

    let app_state = Arc::new(AppState { pool });

    let app = Router::new()
        .route("/api/health", get(healt_check))
        .route("/api/laptime/{driver_nr}", get(get_driver_laptimes))
        .route("/api/gap/{driver_nr}", get(get_driver_gap))
        .layer(cors)
        .with_state(app_state);

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
