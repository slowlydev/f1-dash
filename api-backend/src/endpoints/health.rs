use axum::{http::StatusCode, response::IntoResponse};

pub async fn check() -> Result<impl IntoResponse, StatusCode> {
    Ok(StatusCode::OK)
}
