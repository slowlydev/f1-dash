use axum::{http::StatusCode, response::IntoResponse};
use serde::Serialize;

#[derive(Debug, Serialize)]
struct HealthCheckResponse {
    service: bool,
}

pub async fn health_check() -> impl IntoResponse {
    let response = HealthCheckResponse { service: true };

    (StatusCode::OK, axum::Json(response))
}
