use serde::Serialize;
use sqlx::PgPool;

use super::tables;

// per driver, lap time
#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverLapTimeHistory {
    pub driver_nr: String,
    pub lap_times: Option<Vec<i64>>,
}

pub async fn driver_lap_time(pool: PgPool) -> Option<Vec<DriverLapTimeHistory>> {
    let rows = sqlx::query_as!(
        DriverLapTimeHistory,
        r#"
        select driver_nr, array_agg(lap_time) AS lap_times
        from driver_timing
        where lap_time is not null
        group by driver_nr
        order by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    rows.ok()
}

// per driver, gap

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverLeaderGapHistory {
    pub driver_nr: String,
    pub leader_gap_history: Option<Vec<i64>>,
}

pub async fn driver_leader_gap(pool: PgPool) -> Option<Vec<DriverLeaderGapHistory>> {
    let rows = sqlx::query_as!(
        DriverLeaderGapHistory,
        r#"
        select driver_nr, array_agg(gap_to_leader) AS leader_gap_history
        from driver_timing
        where gap_to_leader is not null
        group by driver_nr
        order by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    rows.ok()
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverAheadGapHistory {
    pub driver_nr: String,
    pub ahead_gap_history: Option<Vec<i64>>,
}

pub async fn driver_ahead_gap(pool: PgPool) -> Option<Vec<DriverAheadGapHistory>> {
    let rows = sqlx::query_as!(
        DriverAheadGapHistory,
        r#"
        select driver_nr, array_agg(gap_to_ahead) AS ahead_gap_history
        from driver_timing
        where gap_to_ahead is not null
        group by driver_nr
        order by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    rows.ok()
}

// per driver, per sector, sector time
#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverSectorHistory {
    pub driver_nr: String,
    pub sector_nr: i64,
    pub time_history: Option<Vec<i64>>,
}

pub async fn driver_sector(pool: PgPool) -> Option<Vec<DriverSectorHistory>> {
    let rows = sqlx::query_as!(
        DriverSectorHistory,
        r#"
        select driver_nr, number as sector_nr, array_agg(time) AS time_history
        from driver_sector
        where time is not null
        group by driver_nr, number
        order by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    rows.ok()
}

// weather, per property

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct WeatherHistory {
    pub humidity: Option<Vec<f64>>,
    pub pressure: Option<Vec<f64>>,
    pub rainfall: Option<Vec<bool>>,
    pub wind_direction: Option<Vec<i64>>,
    pub wind_speed: Option<Vec<f64>>,
    pub air_temp: Option<Vec<f64>>,
    pub track_temp: Option<Vec<f64>>,
}

pub async fn weather(pool: PgPool) -> Option<WeatherHistory> {
    let rows = sqlx::query_as!(
        WeatherHistory,
        r#"
        select array_agg(humidity) AS humidity,
        array_agg(pressure)        AS pressure,
        array_agg(rainfall)        AS rainfall,
        array_agg(wind_direction)  AS wind_direction,
        array_agg(wind_speed)      AS wind_speed,
        array_agg(air_temp)        AS air_temp,
        array_agg(track_temp)      AS track_temp
        from weather;
        "#,
    )
    .fetch_one(&pool)
    .await;

    rows.ok()
}
