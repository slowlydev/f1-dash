use axum::{extract::Query, http::StatusCode, response::IntoResponse};
use serde::Deserialize;
use std::env;
use tracing::error;

#[derive(Deserialize)]
pub struct Params {
    path: String,
}

pub async fn get_audio(Query(params): Query<Params>) -> Result<impl IntoResponse, StatusCode> {
    let Ok(_) = env::var("ENABLE_AUDIO_FETCH") else {
        return Err(StatusCode::NOT_IMPLEMENTED);
    };

    let audio_url = format!("https://livetiming.formula1.com/static/{}", params.path);

    let Ok(response) = reqwest::get(&audio_url).await else {
        error!("Failed to retrieve audio data from {}", audio_url);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    };

    let Ok(bytes) = response.bytes().await else {
        error!("Failed to decode response from {}", audio_url);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    };

    Ok(bytes.as_ref().to_vec())
}
