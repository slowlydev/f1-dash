use chrono::{DateTime, Utc};
use serde_json::Value;
use sqlx::PgPool;

pub struct Update {
    pub category: String,
    pub state: Value,
}

pub async fn updates(
    pool: PgPool,
    start: DateTime<Utc>,
    end: DateTime<Utc>,
) -> Result<Vec<Update>, anyhow::Error> {
    let updates = sqlx::query_as!(
		Update,
		"select category, state from updates where created_at > $1 and created_at < $2 and category != 'initial' order by created_at desc",
		start,
		end
	)
	.fetch_all(&pool)
	.await?;

    Ok(updates)
}
