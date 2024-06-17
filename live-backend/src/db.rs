use std::error::Error;

use sqlx::PgPool;
use tracing::info;

pub async fn init() -> Result<PgPool, Box<dyn Error>> {
    info!("starting...");

    let database_url = std::env::var("DATABASE_URL")?;

    let db = sqlx::postgres::PgPoolOptions::new()
        .max_connections(20)
        .connect(&database_url)
        .await?;

    sqlx::migrate!().run(&db).await?;

    Ok(db)
}
