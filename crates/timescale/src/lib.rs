use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;

pub mod app_timing;
pub mod timing;

// pub use app_timing::insert_tire_driver;
// pub use timing::{get_laptimes, insert_timing_driver};

pub async fn init_timescaledb(migrate: bool) -> Result<PgPool, anyhow::Error> {
    let database_url = env::var("DATABASE_URL")?;

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await?;

    if migrate {
        sqlx::migrate!().run(&pool).await?;
    }

    Ok(pool)
}
