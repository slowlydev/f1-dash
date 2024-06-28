use std::{sync::Arc, time::Duration};

use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use chrono::{DateTime, Utc};
use serde_json::Value;

use super::AppState;

#[derive(serde::Deserialize)]
pub struct DelayQuery {
    delay: u64,
}

#[derive(serde::Serialize)]
pub struct StateSnapshot {
    pub state: Value,
    pub timestamp: DateTime<Utc>,
}

pub async fn range(
    State(state): State<Arc<AppState>>,
    query: Query<DelayQuery>,
) -> Result<impl IntoResponse, StatusCode> {
    let snapshots = sqlx::query_as!(
        StateSnapshot,
        r#"select state, time as timestamp from state where time >= $1"#,
        Utc::now() - Duration::from_secs(query.delay)
    )
    .fetch_all(&state.db)
    .await;

    match snapshots {
        Ok(snapshots) => Ok((StatusCode::OK, Json(snapshots))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}
