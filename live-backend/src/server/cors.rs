use axum::http::{HeaderValue, Method};
use tower_http::cors::CorsLayer;

pub fn init() -> CorsLayer {
    let origin = std::env::var("ORIGIN").expect("no origin env found");

    CorsLayer::new()
        .allow_origin(origin.parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::CONNECT])
}
