use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

pub struct TimingDriver {
    pub nr: String,
    pub lap: Option<i32>,
    pub gap: i64,
    pub leader_gap: i64,
    pub laptime: i64,
    pub sector_1: i64,
    pub sector_2: i64,
    pub sector_3: i64,
}

pub async fn insert_timing_driver(
    pool: &PgPool,
    driver: TimingDriver,
) -> Result<(), anyhow::Error> {
    sqlx::query!(
        r#"
        insert into timing_driver (nr, lap, gap, leader_gap, laptime, sector_1, sector_2, sector_3)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        "#,
        driver.nr,
        driver.lap,
        driver.gap,
        driver.leader_gap,
        driver.laptime,
        driver.sector_1,
        driver.sector_2,
        driver.sector_3
    )
    .execute(pool)
    .await?;

    Ok(())
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Laptime {
    pub time: DateTime<Utc>,
    pub lap: Option<i32>,
    pub laptime: i64,
}

pub async fn get_laptimes(pool: &PgPool, nr: &str) -> Result<Vec<Laptime>, anyhow::Error> {
    let laptimes = sqlx::query!(
        r#"
        select
            lap,
            min(laptime) AS "laptime!",
            min(time) AS "time!"
        from
            timing_driver
        where
            nr = $1
            and laptime != 0
        group by
            lap
        order by
            lap;
        "#,
        nr
    )
    .map(|row| Laptime {
        time: row.time,
        lap: row.lap,
        laptime: row.laptime,
    })
    .fetch_all(pool)
    .await?;

    Ok(laptimes)
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Gap {
    pub time: DateTime<Utc>,
    pub gap: i64,
}

pub async fn get_gaps(pool: &PgPool, nr: &str) -> Result<Vec<Gap>, anyhow::Error> {
    let gaps = sqlx::query!(
        r#"
        select
            gap as "gap!",
            time as "time!"
        from
            timing_driver
        where
            nr = $1
            and gap != 0
        "#,
        nr
    )
    .map(|row| Gap {
        time: row.time,
        gap: row.gap,
    })
    .fetch_all(pool)
    .await?;

    Ok(gaps)
}
