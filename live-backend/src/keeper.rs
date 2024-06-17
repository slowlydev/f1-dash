use std::{mem, thread, time::Duration};

use sqlx::PgPool;
use tracing::{debug, error};

use crate::LiveState;

fn value_is_empty(value: &serde_json::Value) -> bool {
    value.as_object().map_or(true, |o| o.is_empty())
}

pub fn spawn_init(pool: PgPool, state: LiveState) {
    thread::spawn(move || {
        let rt = tokio::runtime::Runtime::new().unwrap();

        rt.block_on(async {
            loop {
                let state_arc = state.lock().unwrap();
                let state = state_arc.clone();
                mem::drop(state_arc);

                if value_is_empty(&state) {
                    tokio::time::sleep(Duration::from_secs(2)).await;
                    continue;
                }

                let query = sqlx::query!(
                    r#"insert into state (time, state) values (now(), $1)"#,
                    state
                )
                .execute(&pool)
                .await;

                match query {
                    Ok(_) => debug!("state saved"),
                    Err(e) => error!("failed to save state: {}", e),
                }

                tokio::time::sleep(Duration::from_secs(1)).await;
            }
        });
    });
}
