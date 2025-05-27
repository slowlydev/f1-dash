use sqlx::PgPool;

pub struct TireDriver {
    pub nr: String,
    pub lap: Option<i32>,
    pub compound: String,
    pub laps: i32,
}

pub async fn insert_tire_driver(pool: &PgPool, driver: TireDriver) -> Result<(), anyhow::Error> {
    sqlx::query(
        r#"
        insert into tire_driver (nr, lap, compound, laps)
        values ($1, $2, $3, $4)
        "#,
    )
    .bind(driver.nr)
    .bind(driver.lap)
    .bind(driver.compound)
    .bind(driver.laps)
    .execute(pool)
    .await?;

    Ok(())
}
