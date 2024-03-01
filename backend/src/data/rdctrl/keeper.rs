use std::collections::HashMap;

use serde_json::Value;
use sqlx::PgPool;

use crate::client;

pub async fn save_initial(pool: PgPool, state: Value) {
    let _ = sqlx::query!(
        r#"
		insert into updates (category, state)
		values ('initial', $1)
		"#,
        state
    )
    .execute(&pool)
    .await;
}

pub async fn save_updates(pool: PgPool, updates: HashMap<String, client::parser::Update>) {
    for (_, update) in updates {
        tokio::spawn(save_update(pool.clone(), update));
    }
}

async fn save_update(pool: PgPool, update: client::parser::Update) {
    let _ = sqlx::query!(
        r#"
		insert into updates (category, state)
		values ($1, $2)
		"#,
        update.category,
        update.state
    )
    .execute(&pool)
    .await;
}
