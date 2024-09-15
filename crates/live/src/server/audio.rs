use axum::{extract::Query, response::IntoResponse};
use serde::Deserialize;
use tracing::error;

#[derive(Deserialize)]

pub struct Params {
    path: String
}

pub async fn get_audio(Query(params): Query<Params>) -> Result<impl IntoResponse, axum::http::StatusCode> {
    let Ok(_) = std::env::var("ENABLE_AUDIO_FETCH") else { return Err(axum::http::StatusCode::NOT_IMPLEMENTED) };

    let audio_url = format!("https://livetiming.formula1.com/static/{}", params.path);
    match reqwest::get(&audio_url).await {
        Ok(response) => {
            match response.bytes().await {
                Ok(bytes) => Ok(bytes.as_ref().to_vec()),
                Err(_) => {
                    error!("Failed to decode response from {}", audio_url);
                    Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
                }
            }
        }
        Err(_) => {
            error!("Failed to retrieve audio data from {}", audio_url);
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
