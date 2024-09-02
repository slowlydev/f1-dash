use std::{error::Error, net::SocketAddr, sync::Arc, thread, time::Duration};

use axum::{routing::get, Router};
use tokio::sync::broadcast;
use tower_governor::{
    governor::GovernorConfigBuilder, key_extractor::SmartIpKeyExtractor, GovernorLayer,
};
use tracing::info;

use crate::{LiveEvent, LiveState};

mod cors;
mod health;
pub mod live;

pub struct AppState {
    tx: broadcast::Sender<LiveEvent>,
    state: LiveState,
}

fn addr() -> String {
    std::env::var("LIVE_BACKEND_ADDRESS").unwrap_or("0.0.0.0:4000".to_string())
}

const CLEANUP_INTERVAL: u64 = 60;

pub async fn init(
    tx: broadcast::Sender<LiveEvent>,
    state: LiveState,
) -> Result<(), Box<dyn Error>> {
    let cors = cors::init();

    let governor_conf = Arc::new(
        GovernorConfigBuilder::default()
            .per_second(4)
            .burst_size(8)
            .key_extractor(SmartIpKeyExtractor)
            .finish()
            .unwrap(),
    );

    let governor_limiter = governor_conf.limiter().clone();
    let interval = Duration::from_secs(CLEANUP_INTERVAL);

    thread::spawn(move || loop {
        thread::sleep(interval);
        tracing::info!("rate limiting storage size: {}", governor_limiter.len());
        governor_limiter.retain_recent();
    });

    let governor = GovernorLayer {
        config: governor_conf,
    };

    let app_state = Arc::new(AppState { tx, state });

    let app = Router::new()
        .route("/api/sse", get(live::sse_handler))
        .route("/api/health", get(health::check))
        .layer(cors)
        .layer(governor)
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
