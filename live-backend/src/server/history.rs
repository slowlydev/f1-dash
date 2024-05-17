use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use sqlx::PgPool;

use super::AppState;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct Driver {
    nr: i64,
    gap_ahead: Option<Vec<String>>,
    gap_leader: Option<Vec<String>>,
    laptime: Option<Vec<String>>,
    sectors: [Option<Vec<String>>; 3],
}

pub async fn get_driver(
    Path(id): Path<i64>,
    State(state): State<Arc<AppState>>,
) -> Result<impl IntoResponse, StatusCode> {
    let (gap_ahead, gap_leader, laptime, sector_1, sector_2, sector_3) = tokio::join!(
        gap_ahead(&id, &state.db),
        gap_leader(&id, &state.db),
        laptime(&id, &state.db),
        sector(&id, &1, &state.db),
        sector(&id, &2, &state.db),
        sector(&id, &3, &state.db),
    );

    let driver = Driver {
        nr: id,
        gap_ahead,
        gap_leader,
        laptime,
        sectors: [sector_1, sector_2, sector_3],
    };

    Ok(Json(driver))
}

async fn gap_ahead(id: &i64, db: &PgPool) -> Option<Vec<String>> {
    let gap_ahead = sqlx::query!(
        r#"select v::text from (
            select state -> 'timingData' -> 'lines' -> $1 -> 'intervalToPositionAhead' ->> 'value' AS v from state order by time desc
        ) as sub where v is not null limit 20;
        "#,
        id.to_string()
    )
    .fetch_one(db)
    .await
    .ok()
    .into_iter()
    .filter_map(|r| r.v)
    .filter(|v| v.len() > 0)
    .collect::<Vec<String>>();

    Some(gap_ahead)
}

async fn gap_leader(id: &i64, db: &PgPool) -> Option<Vec<String>> {
    let gap_leader = sqlx::query!(
        r#"select v::text from (
            select state -> 'timingData' -> 'lines' -> $1 ->> 'gapToLeader' AS v from state order by time desc
        ) as sub where v is not null limit 20;
        "#,
        id.to_string()
    )
    .fetch_one(db)
    .await
    .ok()
    .into_iter()
    .filter_map(|r| r.v)
    .filter(|v| v.len() > 0)
    .collect::<Vec<String>>();

    Some(gap_leader)
}

async fn laptime(id: &i64, db: &PgPool) -> Option<Vec<String>> {
    let laptimes = sqlx::query!(
        r#"select v::text from (
            select state -> 'timingData' -> 'lines' -> $1 -> 'lastLapTime' ->> 'value' as v from state order by time desc
        ) as sub where v is not null limit 20;
        "#,
        id.to_string()
    )
    .fetch_one(db)
    .await
    .ok()
    .into_iter()
    .filter_map(|r| r.v)
    .filter(|v| v.len() > 0)
    .collect::<Vec<String>>();

    Some(laptimes)
}

async fn sector(id: &i64, sector_nr: &i8, db: &PgPool) -> Option<Vec<String>> {
    let laptimes = sqlx::query!(
        r#"select v::text from (
            select state -> 'timingData' -> 'lines' -> $1 -> 'sectors' -> $2 ->> 'value' as v from state order by time desc
        ) as sub where v is not null limit 20;
        "#,
        id.to_string(),
        sector_nr.to_string()
    )
    .fetch_one(db)
    .await
    .ok()
    .into_iter()
    .filter_map(|r| r.v)
    .filter(|v| v.len() > 0)
    .collect::<Vec<String>>();

    Some(laptimes)
}
