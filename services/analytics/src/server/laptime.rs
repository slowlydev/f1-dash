use std::sync::Arc;

use timescale::timing::{get_laptimes, Laptime};

use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};

use tracing::error;

use crate::AppState;

#[derive(serde::Deserialize)]
pub struct Params {
    driver_nr: String,
}

pub async fn get_driver_laptimes(
    State(app_state): State<Arc<AppState>>,
    Path(Params { driver_nr }): Path<Params>,
) -> Result<Json<Vec<Laptime>>, StatusCode> {
    let laptimes = get_laptimes(&app_state.pool, &driver_nr).await;

    match laptimes {
        Ok(laptimes) => Ok(Json(laptimes)),
        Err(error) => {
            error!(?error, driver_nr, "failed to get laptimes");
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
