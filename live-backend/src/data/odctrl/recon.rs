use anyhow::Ok;
use chrono::{DateTime, Utc};
use serde_json::{Map, Value};
use sqlx::PgPool;
use tracing::debug;

use crate::data::odctrl::merge;

struct Update {
    pub category: String,
    pub state: Value,
}

struct Initial {
    pub state: Value,
    pub created_at: chrono::DateTime<Utc>,
}

struct InitialState {
    pub state: Value,
}

pub async fn initial(pool: &PgPool, timestamp: DateTime<Utc>) -> Result<Value, anyhow::Error> {
    // reconstruct a initial value for the frontend

    // two approaches possible
    // 1. use initial state and reconstruct forward to timestamp
    // 2. go from timestamp back and assemble an initial state, would require checks and maybe caching to speed up checks

    // currently we use 1. but it might be really slow

    let initial = sqlx::query_as!(
        Initial,
        "select state, created_at from updates where category = 'initial' and created_at < $1 order by created_at desc",
        timestamp
    )
    .fetch_one(pool)
    .await?;

    let updates = sqlx::query_as!(
        Update,
        "select category, state from updates where category != 'initial' and created_at > $1 order by created_at asc",
        initial.created_at
    )
    .fetch_all(pool)
    .await?;

    let mut reconstructed_initial: Value = initial.state;

    debug!("reconstructing initial out of {} updates", updates.len());

    // this loop might have to run up to 75k times (after a full GrandPrix)
    // let hope this doesn't take ages...
    for update in updates {
        let mut map = Map::new();
        map.insert(update.category, update.state);
        merge::category_merge(&mut reconstructed_initial, map);
    }

    Ok(reconstructed_initial)
}

pub async fn delayed_initial(
    pool: &PgPool,
    timestamp: DateTime<Utc>,
) -> Result<Value, anyhow::Error> {
    // reconstruct a initial value for the frontend

    // two approaches possible
    // 1. use initial state and reconstruct forward to timestamp
    // 2. go from timestamp back and assemble an initial state, would require checks and maybe caching to speed up checks

    // currently we use 1. but it might be really slow

    let initial = sqlx::query_as!(
        InitialState,
        "select state from updates where category = 'initial' and created_at < $1 order by created_at desc",
        timestamp
    )
    .fetch_one(pool)
    .await?;

    let updates = sqlx::query_as!(
        Update,
        "select category, state from updates where category != 'initial' and created_at < $1 order by created_at asc",
        timestamp
    )
    .fetch_all(pool)
    .await?;

    let mut reconstructed_initial: Value = initial.state;

    debug!("reconstructing initial out of {} updates", updates.len());

    // this loop might have to run up to 75k times (after a full GrandPrix)
    // let hope this doesn't take ages...
    for update in updates {
        let mut map = Map::new();
        map.insert(update.category, update.state);
        merge::category_merge(&mut reconstructed_initial, map);
    }

    Ok(reconstructed_initial)
}
