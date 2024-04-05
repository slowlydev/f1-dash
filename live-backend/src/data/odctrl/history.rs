use chrono::{DateTime, Duration, Utc};
use serde::Serialize;
use sqlx::PgPool;
use std::collections::HashMap;
use tracing::debug;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Weather {
    pub air_temp: Vec<f64>,
    pub track_temp: Vec<f64>,
    pub humidity: Vec<f64>,
    pub pressure: Vec<f64>,
    pub rainfall: Vec<bool>,
    pub wind_direction: Vec<i64>,
    pub wind_speed: Vec<f64>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct History {
    pub gap_leader: Option<HashMap<String, Vec<i64>>>,
    pub gap_front: Option<HashMap<String, Vec<i64>>>,
    pub lap_time: Option<HashMap<String, Vec<i64>>>,
    pub sectors: Option<HashMap<String, HashMap<String, Vec<i64>>>>,
    pub weather: Option<Weather>,
}

pub fn create_empty() -> History {
    History {
        gap_leader: None,
        gap_front: None,
        lap_time: None,
        sectors: None,
        weather: None,
    }
}

pub struct Driver {
    pub key: Option<String>,
    pub gaps: Option<Vec<String>>,
}

pub struct DriverSector {
    pub key: Option<String>,
    pub sector_nr: Option<String>,
    pub values: Option<Vec<String>>,
}

pub struct WeatherEntry {
    pub air_temp: Option<f64>,
    pub track_temp: Option<f64>,
    pub humidity: Option<f64>,
    pub pressure: Option<f64>,
    pub rainfall: Option<bool>,
    pub wind_direction: Option<i64>,
    pub wind_speed: Option<f64>,
}

pub type Queries = (
    Result<Vec<Driver>, anyhow::Error>,
    Result<Vec<Driver>, anyhow::Error>,
    Result<Vec<Driver>, anyhow::Error>,
    Result<Vec<DriverSector>, anyhow::Error>,
    Result<Vec<WeatherEntry>, anyhow::Error>,
);

pub async fn queries(pool: PgPool, timestamp: DateTime<Utc>) -> Queries {
    let start = timestamp.clone() - Duration::minutes(10);
    let end = timestamp;

    debug!("reconstructing history from {} back to {}", start, end);

    let gap_leader = driver_gap_leader(pool.clone(), start, end);
    let gap_front = driver_gap_front(pool.clone(), start, end);
    let lap_time = driver_lap_time(pool.clone(), start, end);
    let sectors = sectors(pool.clone(), start, end);
    let weather = weather(pool.clone(), start, end);

    tokio::join!(gap_leader, gap_front, lap_time, sectors, weather)
}

async fn weather(
    pool: PgPool,
    start: DateTime<Utc>,
    end: DateTime<Utc>,
) -> Result<Vec<WeatherEntry>, anyhow::Error> {
    let weather = sqlx::query_as!(
        WeatherEntry,
        "select
            cast(state ->> 'trackTemp' as float8) as track_temp,
            cast(state ->> 'airTemp' as float8) as air_temp,
            cast(state ->> 'humidity' as float8) as humidity,
            cast(state ->> 'pressure' as float8) as pressure,
            cast(state ->> 'rainfall' as bool) as rainfall,
            cast(state ->> 'windDirection' as int8) as wind_direction,
            cast(state ->> 'windSpeed' as float8) as wind_speed
        from updates where category = 'weatherData' and created_at > $1 and created_at < $2
        ",
        start,
        end
    )
    .fetch_all(&pool)
    .await?;

    Ok(weather)
}

async fn sectors(
    pool: PgPool,
    start: DateTime<Utc>,
    end: DateTime<Utc>,
) -> Result<Vec<DriverSector>, anyhow::Error> {
    let driver_sector = sqlx::query_as!(
        DriverSector,
        "select key, sector_nr, array_agg(value) as values from (
            select
                driver_key::text as key,
                sector_key::text as sector_nr,
                NULLIF((state -> 'lines' -> driver_key -> 'sectors' -> sector_key ->> 'value'), '') as value
            from (
                select
                    driver_key,
                    jsonb_object_keys(state -> 'lines' -> driver_key -> 'sectors') as sector_key,
                    state
                from (
                    select
                        jsonb_object_keys(state -> 'lines') as driver_key,
                        state
                    from updates
                    where category = 'timingData' and created_at > $1 and created_at < $2
                ) as drivers
            ) as driver_sectors
        ) as aggregated_driver_sectors where value is not null and key is not null group by key, sector_nr;",
        start,
        end
    )
    .fetch_all(&pool)
    .await?;

    Ok(driver_sector)
}

pub async fn driver_gap_leader(
    pool: PgPool,
    start: DateTime<Utc>,
    end: DateTime<Utc>,
) -> Result<Vec<Driver>, anyhow::Error> {
    let driver_gap_leader = sqlx::query_as!(
        Driver,
        "select key, array_agg(gap) as gaps from (
            select
                driver_key::text AS key,
                (state -> 'lines' -> driver_key ->> 'gapToLeader')::text AS gap
            from (
                select
                    jsonb_object_keys(state -> 'lines') AS driver_key,
                    state
                from updates where category = 'timingData' and created_at > $1 and created_at < $2
            ) AS driver_gaps
        ) as aggregated_driver_gaps where gap is not null and key is not null group by key",
        start,
        end
    )
    .fetch_all(&pool)
    .await?;

    Ok(driver_gap_leader)
}

pub async fn driver_gap_front(
    pool: PgPool,
    start: DateTime<Utc>,
    end: DateTime<Utc>,
) -> Result<Vec<Driver>, anyhow::Error> {
    let driver_gap_front = sqlx::query_as!(
        Driver,
        "select key, array_agg(gap) as gaps from (
            select
                driver_key::text AS key,
                (state -> 'lines' -> driver_key -> 'intervalToPositionAhead' ->> 'value' )::text AS gap
            from (
                select
                    jsonb_object_keys(state -> 'lines') AS driver_key,
                    state
                from updates where category = 'timingData' and created_at > $1 and created_at < $2
            ) AS driver_gaps
        ) as aggregated_driver_gaps where gap is not null and key is not null group by key",
        start,
        end
    )
    .fetch_all(&pool)
    .await?;

    Ok(driver_gap_front)
}

pub async fn driver_lap_time(
    pool: PgPool,
    start: DateTime<Utc>,
    end: DateTime<Utc>,
) -> Result<Vec<Driver>, anyhow::Error> {
    let driver_lap_time = sqlx::query_as!(
        Driver,
        "select key, array_agg(gap) as gaps from (
            select
                driver_key::text AS key,
                (state -> 'lines' -> driver_key -> 'lastLapTime' ->> 'value' )::text AS gap
            from (
                select
                    jsonb_object_keys(state -> 'lines') AS driver_key,
                    state
                from updates where category = 'timingData' and created_at > $1 and created_at < $2
            ) AS driver_gaps
        ) as aggregated_driver_gaps where gap is not null and key is not null group by key",
        start,
        end
    )
    .fetch_all(&pool)
    .await?;

    Ok(driver_lap_time)
}

pub fn parse_string_duration(string: &str) -> Option<i64> {
    if string.contains("LAP") {
        return Some(0);
    }

    let regex = regex::Regex::new(r"(\d+).(\d+)").ok()?;
    let (_full, [str_s, str_ms]) = regex.captures(string)?.extract();

    let seconds = Duration::seconds(str_s.parse().unwrap_or(0));
    let milliseconds = Duration::milliseconds(str_ms.parse().unwrap_or(0));

    let result = seconds + milliseconds;

    Some(result.num_milliseconds())
}

pub fn parse_lap_time(string: &str) -> Option<i64> {
    let regex = regex::Regex::new(r"(\d+):(\d+).(\d+)").ok()?;
    let (_full, [str_m, str_s, str_ms]) = regex.captures(string)?.extract();

    let minutes = Duration::minutes(str_m.parse().unwrap_or(0));
    let seconds = Duration::seconds(str_s.parse().unwrap_or(0));
    let milliseconds = Duration::milliseconds(str_ms.parse().unwrap_or(0));

    let result = minutes + seconds + milliseconds;

    Some(result.num_milliseconds())
}
