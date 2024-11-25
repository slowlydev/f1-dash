use std::{mem, sync::Arc};

use axum::extract::State;
use serde_json::Value;
use tracing::error;

use super::AppState;

fn map_to_vec(value: Value) -> Vec<Value> {
    match value {
        Value::Object(map) => map.into_iter().map(|(_, v)| v).collect(),
        _ => vec![],
    }
}

pub async fn get_drivers(
    State(state): State<Arc<AppState>>,
) -> Result<axum::Json<Vec<Value>>, axum::http::StatusCode> {
    let live_state = state.state.lock().unwrap().clone();
    mem::drop(state);

    match live_state.pointer("/driverList") {
        Some(drivers) => Ok(axum::Json(map_to_vec(drivers.clone()))),
        None => {
            error!("failed to get drivers from live state");
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
