use std::sync::Arc;

use timescale::timing::{get_gaps, Gap};

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

pub async fn get_driver_gap(
    State(app_state): State<Arc<AppState>>,
    Path(Params { driver_nr }): Path<Params>,
) -> Result<Json<Vec<Gap>>, StatusCode> {
    let gaps = get_gaps(&app_state.pool, &driver_nr).await;

    match gaps {
        Ok(gaps) => Ok(Json(gaps)),
        Err(error) => {
            error!(?error, driver_nr, "failed to get gaps");
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
