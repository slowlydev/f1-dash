use sqlx::PgPool;

pub mod history;
pub mod insert;
pub mod recon;
pub mod tables;

pub async fn init() -> anyhow::Result<PgPool> {
    let database_url = std::env::var("DATABASE_URL")?;

    let db = sqlx::postgres::PgPoolOptions::new()
        .max_connections(20)
        .connect(&database_url)
        .await?;

    sqlx::migrate!().run(&db).await?;

    Ok(db)
}
