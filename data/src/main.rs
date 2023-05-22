use axum::{http::Method, Router};
use headers::HeaderValue;
use scylla::Session;
use std::{net::SocketAddr, sync::Arc};
use tower_http::{cors::CorsLayer, trace::TraceLayer};

mod scylladb;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let session: Session = scylladb::connect()
        .await
        .expect("Failed to connect to ScyllaDB");

    println!("Connected to ScyllaDB");

    let session_state: Arc<Session> = Arc::new(session);

    let cors_layer: CorsLayer = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET]);

    let app: Router = Router::new()
        .with_state(session_state)
        .layer(cors_layer)
        .layer(TraceLayer::new_for_http());

    let addr: SocketAddr = SocketAddr::from(([127, 0, 0, 1], 4000));

    tracing::debug!("listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
