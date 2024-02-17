pub mod service;
pub mod tables;

pub async fn init() -> anyhow::Result<()> {
    let conn_url = std::env::var("DATABASE_URL")?;
    let pool = sqlx::PgPool::connect(&conn_url).await?;

    sqlx::migrate!().run(&pool).await?;

    // here we do stuff yet what

    Ok(())
}
