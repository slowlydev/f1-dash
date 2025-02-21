use std::sync::Arc;

use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde_json::json;

use super::AppState;

pub async fn get_connections(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let connections = state.tx.receiver_count() - 1;

    (StatusCode::OK, Json(json!({ "connections": connections })))
}
