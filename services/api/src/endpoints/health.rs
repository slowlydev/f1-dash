use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::json;

pub async fn check() -> impl IntoResponse {
    (StatusCode::OK, Json(json!({ "success": true })))
}
