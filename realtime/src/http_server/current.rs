use std::sync::Arc;

use axum::{extract::State, http::StatusCode, response::IntoResponse};

use crate::http_server::Context;

pub async fn current_state(State(ctx): State<Arc<Context>>) -> impl IntoResponse {
    match ctx.state_service.get_state().await {
        Ok(state) => (StatusCode::OK, axum::Json(state)),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            axum::Json(serde_json::json!({
                "error": format!("Failed to get current state: {}", e),
            })),
        ),
    }
}
