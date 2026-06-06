use std::sync::Arc;

use axum::{extract::State, http::StatusCode, response::IntoResponse};
use serde_json::Value;
use tracing::error;

use crate::http_server::Context;

fn map_to_vec(value: Value) -> Vec<Value> {
    match value {
        Value::Object(map) => map
            .into_iter()
            .filter(|(_, v)| v.is_object())
            .map(|(_, v)| v)
            .collect(),
        _ => vec![],
    }
}

pub async fn drivers(State(ctx): State<Arc<Context>>) -> impl IntoResponse {
    match ctx.state_service.get_state().await {
        Ok(state) => match state.pointer("/DriverList") {
            Some(drivers) => Ok(axum::Json(map_to_vec(drivers.clone()))),
            None => {
                error!("failed to get drivers from state");
                Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    axum::Json(serde_json::json!({
                        "error": "failed to get drivers from current state",
                    })),
                ))
            }
        },
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            axum::Json(serde_json::json!({
                "error": format!("Failed to get current state: {}", e),
            })),
        )),
    }
}
