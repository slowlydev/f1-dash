use std::collections::HashMap;

use serde::Serialize;
use sqlx::PgPool;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct History {
    pub lap_time: HashMap<String, Vec<i64>>,
    pub leader_gap: HashMap<String, Vec<i64>>,
    pub ahead_gap: HashMap<String, Vec<i64>>,
    pub sectors: HashMap<String, HashMap<i64, Vec<i64>>>,
    pub weather: Option<WeatherHistory>,
}

impl History {
    pub fn new() -> Self {
        History {
            lap_time: HashMap::new(),
            leader_gap: HashMap::new(),
            ahead_gap: HashMap::new(),
            sectors: HashMap::new(),
            weather: None,
        }
    }
}

// per driver, lap time
#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct LapTimeHistory {
    pub driver_nr: String,
    pub lap_times: Option<Vec<i64>>,
}

pub async fn driver_lap_time(pool: PgPool) -> Option<Vec<LapTimeHistory>> {
    let rows = sqlx::query_as!(
        LapTimeHistory,
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
pub struct LeaderGapHistory {
    pub driver_nr: String,
    pub gaps: Option<Vec<i64>>,
}

pub async fn driver_leader_gap(pool: PgPool) -> Option<Vec<LeaderGapHistory>> {
    let rows = sqlx::query_as!(
        LeaderGapHistory,
        r#"
        select driver_nr,
               array(select gap_to_leader
                     from driver_timing
                     where driver_nr = dt.driver_nr and gap_to_leader is not null
                     limit 20) as gaps
        from driver_timing dt
        group by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    rows.ok()
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct AheadGapHistory {
    pub driver_nr: String,
    pub gaps: Option<Vec<i64>>,
}

pub async fn driver_ahead_gap(pool: PgPool) -> Option<Vec<AheadGapHistory>> {
    let rows = sqlx::query_as!(
        AheadGapHistory,
        r#"
        select driver_nr,
               array(select gap_to_ahead
                     from driver_timing
                     where driver_nr = dt.driver_nr and gap_to_ahead is not null
                     limit 20) as gaps
        from driver_timing dt
        group by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    rows.ok()
}

// per driver, per sector, sector time
#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct SectorHistory {
    pub driver_nr: String,
    pub sector_nr: i64,
    pub times: Option<Vec<i64>>,
}

pub async fn driver_sector(pool: PgPool) -> Option<Vec<SectorHistory>> {
    let rows = sqlx::query_as!(
        SectorHistory,
        r#"
        select driver_nr, number as sector_nr,
               array(select time
                     from driver_sector
                     where driver_nr = ds.driver_nr
                       and number = ds.number
                       and time is not null
                     limit 20) as times
        from driver_sector ds
        group by driver_nr, number;
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
        select
            array ( select humidity
                    from weather
                    where humidity is not null
                    limit 20) as humidity,
            array ( select pressure
                    from weather
                    where pressure is not null
                    limit 20) as pressure,
            array ( select rainfall
                    from weather
                    where rainfall is not null
                    limit 20) as rainfall,
            array ( select wind_direction
                    from weather
                    where wind_direction is not null
                    limit 20) as wind_direction,
            array ( select wind_speed
                    from weather
                    where wind_speed is not null
                    limit 20) as wind_speed,
            array ( select air_temp
                    from weather
                    where air_temp is not null
                    limit 20) as air_temp,
            array ( select track_temp
                    from weather
                    where track_temp is not null
                    limit 20) as track_temp;
        "#,
    )
    .fetch_one(&pool)
    .await;

    rows.ok()
}
