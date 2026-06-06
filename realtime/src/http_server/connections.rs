use std::sync::Arc;

use axum::{extract::State, http::StatusCode, response::IntoResponse};
use serde::Serialize;

use crate::http_server::Context;

#[derive(Debug, Serialize)]
struct ConnectionsResponse {
    connections: usize,
}

pub async fn current_connections(State(ctx): State<Arc<Context>>) -> impl IntoResponse {
    let connections = ctx.tx.receiver_count();

    let response = ConnectionsResponse { connections };

    (StatusCode::OK, axum::Json(response))
}
