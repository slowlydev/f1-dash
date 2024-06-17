use std::sync::Arc;

use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde_json::json;

use super::AppState;

pub async fn check(State(state): State<Arc<AppState>>) -> Result<impl IntoResponse, StatusCode> {
    let db_connected = sqlx::query("SELECT 1").fetch_one(&state.db).await.is_ok();

    if db_connected {
        Ok((StatusCode::OK, Json(json!({ "db": true }))))
    } else {
        Ok((
            StatusCode::SERVICE_UNAVAILABLE,
            Json(json!({ "db": false })),
        ))
    }
}
