use sqlx::PgPool;

use crate::db;

pub async fn session_info(pool: PgPool) -> Option<db::tables::SessionInfo> {
    let row = sqlx::query_as!(
        db::tables::SessionInfo,
        r#"
        SELECT
            last(key,created_at) FILTER(WHERE key IS NOT NULL) AS key,
            last(kind,created_at) FILTER(WHERE kind IS NOT NULL) AS kind,
            last(name,created_at) FILTER(WHERE name IS NOT NULL) AS name,
            last(start_date,created_at) FILTER(WHERE start_date IS NOT NULL) AS start_date,
            last(end_date,created_at) FILTER(WHERE end_date IS NOT NULL) AS end_date,
            last(gmt_offset,created_at) FILTER(WHERE gmt_offset IS NOT NULL) AS gmt_offset,
            last(path,created_at) FILTER(WHERE path IS NOT NULL) AS path,
            last(number,created_at) FILTER(WHERE number IS NOT NULL) AS number
        FROM session_info;
        "#,
    )
    .fetch_one(&pool)
    .await;

    row.ok()
}

pub async fn track_status(pool: PgPool) -> Option<db::tables::TrackStatus> {
    let row = sqlx::query_as!(
        db::tables::TrackStatus,
        r#"
        SELECT
            last(status,created_at) FILTER(WHERE status IS NOT NULL) AS status,
            last(message,created_at) FILTER(WHERE message IS NOT NULL) AS message
        FROM track_status;
        "#,
    )
    .fetch_one(&pool)
    .await;

    row.ok()
}

pub async fn meeting(pool: PgPool) -> Option<db::tables::Meeting> {
    let row = sqlx::query_as!(
        db::tables::Meeting,
        r#"
        SELECT
        	last(key,created_at) FILTER(WHERE key IS NOT NULL) AS key,
        	last(name,created_at) FILTER(WHERE name IS NOT NULL) AS name,
        	last(official_name,created_at) FILTER(WHERE official_name IS NOT NULL) AS official_name,
         	last(location,created_at) FILTER(WHERE location IS NOT NULL) AS location,
          	last(country_key,created_at) FILTER(WHERE country_key IS NOT NULL) AS country_key,
           	last(country_code,created_at) FILTER(WHERE country_code IS NOT NULL) AS country_code,
            last(country_name,created_at) FILTER(WHERE country_name IS NOT NULL) AS country_name,
            last(circuit_key,created_at) FILTER(WHERE circuit_key IS NOT NULL) AS circuit_key,
            last(circuit_name,created_at) FILTER(WHERE circuit_name IS NOT NULL) AS circuit_name
        FROM meeting;
        "#,
    )
    .fetch_one(&pool)
    .await;

    row.ok()
}

pub async fn lap_count(pool: PgPool) -> Option<db::tables::LapCount> {
    let row = sqlx::query_as!(
        db::tables::LapCount,
        r#"
        SELECT
        	last(current,created_at) FILTER(WHERE current IS NOT NULL) AS current,
         	last(total,created_at) FILTER(WHERE total IS NOT NULL) AS total
        FROM lap_count;
        "#,
    )
    .fetch_one(&pool)
    .await;

    row.ok()
}

pub async fn weather(pool: PgPool) -> Option<db::tables::Weather> {
    let row = sqlx::query_as!(
        db::tables::Weather,
        r#"
        SELECT
        	last(humidity,created_at) FILTER(WHERE humidity IS NOT NULL) AS humidity,
         	last(pressure,created_at) FILTER(WHERE pressure IS NOT NULL) AS pressure,
          	last(rainfall,created_at) FILTER(WHERE rainfall IS NOT NULL) AS rainfall,
           	last(wind_direction,created_at) FILTER(WHERE wind_direction IS NOT NULL) AS wind_direction,
            last(wind_speed,created_at) FILTER(WHERE wind_speed IS NOT NULL) AS wind_speed,
            last(air_temp,created_at) FILTER(WHERE air_temp IS NOT NULL) AS air_temp,
            last(track_temp,created_at) FILTER(WHERE track_temp IS NOT NULL) AS track_temp
        FROM weather;
        "#,
    )
    .fetch_one(&pool)
    .await;

    row.ok()
}

pub async fn race_control_messages(pool: PgPool) -> Option<Vec<db::tables::RaceControlMessages>> {
    let row = sqlx::query_as!(
        db::tables::RaceControlMessages,
        r#" SELECT utc, lap, message, category, flag, scope, sector, drs_enabled FROM race_control_messages;
        "#,
    )
    .fetch_all(&pool)
    .await;

    row.ok()
}

pub async fn team_radio(pool: PgPool) -> Option<Vec<db::tables::TeamRadio>> {
    let row = sqlx::query_as!(
        db::tables::TeamRadio,
        r#"
        select utc, driver_nr, url from team_radio;
        "#,
    )
    .fetch_all(&pool)
    .await;

    row.ok()
}

pub async fn general_timing(pool: PgPool) -> Option<db::tables::GeneralTiming> {
    let row = sqlx::query_as!(
        db::tables::GeneralTiming,
        r#"
        select
        	last(no_entries,created_at) FILTER(WHERE no_entries IS NOT NULL) AS no_entries,
         	last(session_part,created_at) FILTER(WHERE session_part IS NOT NULL) AS session_part,
          	last(cut_off_time,created_at) FILTER(WHERE cut_off_time IS NOT NULL) AS cut_off_time,
           	last(cut_off_percentage,created_at) FILTER(WHERE cut_off_percentage IS NOT NULL) AS cut_off_percentage
        from general_timing;
        "#,
    )
    .fetch_one(&pool)
    .await;

    row.ok()
}

pub async fn driver(pool: PgPool) -> Option<Vec<db::tables::Driver>> {
    let row = sqlx::query_as!(
        db::tables::Driver,
        r#"
        select
        	driver_nr,
        	last(full_name,created_at) FILTER(WHERE full_name IS NOT NULL) AS full_name,
         	last(first_name,created_at) FILTER(WHERE first_name IS NOT NULL) AS first_name,
          	last(last_name,created_at) FILTER(WHERE last_name IS NOT NULL) AS last_name,
           	last(short,created_at) FILTER(WHERE short IS NOT NULL) AS short,
            last(country,created_at) FILTER(WHERE country IS NOT NULL) AS country,
            last(line,created_at) FILTER(WHERE line IS NOT NULL) AS line,
            last(team_name,created_at) FILTER(WHERE team_name IS NOT NULL) AS team_name,
            last(team_color,created_at) FILTER(WHERE team_color IS NOT NULL) AS team_color,
            last(picture,created_at) FILTER(WHERE picture IS NOT NULL) AS picture
        from driver
        group by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    row.ok()
}

pub async fn driver_timing(pool: PgPool) -> Option<Vec<db::tables::DriverTiming>> {
    let rows = sqlx::query_as!(
		db::tables::DriverTiming,
		r#"
		select
   			driver_nr,
   			last(position,created_at) FILTER(WHERE position IS NOT NULL) AS position,
   			last(line,created_at) FILTER(WHERE line IS NOT NULL) AS line,
   			last(show_position,created_at) FILTER(WHERE show_position IS NOT NULL) AS show_position,
   			last(gap_to_ahead,created_at) FILTER(WHERE gap_to_ahead IS NOT NULL) AS gap_to_ahead,
   			last(gap_to_leader,created_at) FILTER(WHERE gap_to_leader IS NOT NULL) AS gap_to_leader,
   			last(gap_to_leader_laps,created_at) FILTER(WHERE gap_to_leader_laps IS NOT NULL) AS gap_to_leader_laps,
   			last(gap_to_ahead_laps,created_at) FILTER(WHERE gap_to_ahead_laps IS NOT NULL) AS gap_to_ahead_laps,
   			last(catching_ahead,created_at) FILTER(WHERE catching_ahead IS NOT NULL) AS catching_ahead,
   			last(lap_time,created_at) FILTER(WHERE lap_time IS NOT NULL) AS lap_time,
   			last(lap_time_fastest,created_at) FILTER(WHERE lap_time_fastest IS NOT NULL) AS lap_time_fastest,
   			last(lap_time_pb,created_at) FILTER(WHERE lap_time_pb IS NOT NULL) AS lap_time_pb,
   			last(number_of_laps,created_at) FILTER(WHERE number_of_laps IS NOT NULL) AS number_of_laps,
   			last(number_of_pit_stops,created_at) FILTER(WHERE number_of_pit_stops IS NOT NULL) AS number_of_pit_stops,
   			last(status,created_at) FILTER(WHERE status IS NOT NULL) AS status,
   			last(retired,created_at) FILTER(WHERE retired IS NOT NULL) AS retired,
   			last(in_pit,created_at) FILTER(WHERE in_pit IS NOT NULL) AS in_pit,
   			last(pit_out,created_at) FILTER(WHERE pit_out IS NOT NULL) AS pit_out,
   			last(knocked_out,created_at) FILTER(WHERE knocked_out IS NOT NULL) AS knocked_out,
   			last(stopped,created_at) FILTER(WHERE stopped IS NOT NULL) AS stopped
      	from driver_timing
       	group by driver_nr;
		"#,
	)
	.fetch_all(&pool)
	.await;

    rows.ok()
}

pub async fn driver_sector(pool: PgPool) -> Option<Vec<db::tables::DriverSector>> {
    let row = sqlx::query_as!(
        db::tables::DriverSector,
        r#"
        select
        	driver_nr,
         	number,
        	last(time,created_at) FILTER(WHERE time IS NOT NULL) AS time,
         	last(previous_time,created_at) FILTER(WHERE previous_time IS NOT NULL) AS previous_time,
          	last(status,created_at) FILTER(WHERE status IS NOT NULL) AS status,
           	last(stopped,created_at) FILTER(WHERE stopped IS NOT NULL) AS stopped,
            last(overall_fastest,created_at) FILTER(WHERE overall_fastest IS NOT NULL) AS overall_fastest,
            last(personal_fastest,created_at) FILTER(WHERE personal_fastest IS NOT NULL) AS personal_fastest
        from driver_sector
        group by driver_nr, number;
        "#,
    )
    .fetch_all(&pool)
    .await;

    row.ok()
}

pub async fn driver_sector_segment(pool: PgPool) -> Option<Vec<db::tables::DriverSectorSegment>> {
    let row = sqlx::query_as!(
        db::tables::DriverSectorSegment,
        r#"
        select
        	driver_nr,
         	sector_number,
          	number,
          	last(status,created_at) FILTER(WHERE status IS NOT NULL) AS status
        from driver_sector_segment
        group by driver_nr, sector_number, number;
        "#,
    )
    .fetch_all(&pool)
    .await;

    row.ok()
}

pub async fn driver_stints(pool: PgPool) -> Option<Vec<db::tables::DriverStint>> {
    let row = sqlx::query_as!(
        db::tables::DriverStint,
        r#"
        select
        	driver_nr,
         	stint_nr,
          	last(lap_flags,created_at) FILTER(WHERE lap_flags IS NOT NULL) AS lap_flags,
          	last(compound,created_at) FILTER(WHERE compound IS NOT NULL) AS compound,
          	last(new,created_at) FILTER(WHERE new IS NOT NULL) AS new,
          	last(tires_not_changed,created_at) FILTER(WHERE tires_not_changed IS NOT NULL) AS tires_not_changed,
          	last(total_laps,created_at) FILTER(WHERE total_laps IS NOT NULL) AS total_laps,
          	last(start_laps,created_at) FILTER(WHERE start_laps IS NOT NULL) AS start_laps,
          	last(lap_time,created_at) FILTER(WHERE lap_time IS NOT NULL) AS lap_time,
          	last(lap_number,created_at) FILTER(WHERE lap_number IS NOT NULL) AS lap_number
        from driver_stints
        group by driver_nr, stint_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    row.ok()
}

pub async fn driver_speeds(pool: PgPool) -> Option<Vec<db::tables::DriverSpeeds>> {
    let row = sqlx::query_as!(
        db::tables::DriverSpeeds,
        r#"
        select
        	driver_nr,
         	station,
          	last(value,created_at) FILTER(WHERE value IS NOT NULL) AS value,
          	last(status,created_at) FILTER(WHERE status IS NOT NULL) AS status,
          	last(overall_fastest,created_at) FILTER(WHERE overall_fastest IS NOT NULL) AS overall_fastest,
          	last(personal_fastest,created_at) FILTER(WHERE personal_fastest IS NOT NULL) AS personal_fastest
        from driver_speeds
        group by driver_nr, station;
        "#,
    )
    .fetch_all(&pool)
    .await;

    row.ok()
}

pub async fn driver_stats(pool: PgPool) -> Option<Vec<db::tables::DriverStats>> {
    let row = sqlx::query_as!(
        db::tables::DriverStats,
        r#"
        select
        	driver_nr,
          	last(lap,created_at) FILTER(WHERE lap IS NOT NULL) AS lap,
          	last(pb_lap_time,created_at) FILTER(WHERE pb_lap_time IS NOT NULL) AS pb_lap_time,
          	last(pb_lap_time_pos,created_at) FILTER(WHERE pb_lap_time_pos IS NOT NULL) AS pb_lap_time_pos
        from driver_stats
        group by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    row.ok()
}

pub async fn driver_sector_stats(pool: PgPool) -> Option<Vec<db::tables::DriverSectorStats>> {
    let row = sqlx::query_as!(
        db::tables::DriverSectorStats,
        r#"
        select
        	driver_nr,
         	number,
          	last(value,created_at) FILTER(WHERE value IS NOT NULL) AS value,
          	last(position,created_at) FILTER(WHERE position IS NOT NULL) AS position
        from driver_sector_stats
        group by driver_nr, number;
        "#,
    )
    .fetch_all(&pool)
    .await;

    row.ok()
}

pub struct DriverPositionHistory {
    pub driver_nr: String,
    pub timestamp: Option<String>,
    pub status: Option<String>,
    pub x: Option<f64>,
    pub y: Option<f64>,
    pub z: Option<f64>,
}

pub fn validate_position(optional: &DriverPositionHistory) -> Option<db::tables::DriverPosition> {
    Some(db::tables::DriverPosition {
        driver_nr: optional.driver_nr.clone(),
        timestamp: optional.timestamp.clone()?,
        status: optional.status.clone()?,
        x: optional.x.clone()?,
        y: optional.y.clone()?,
        z: optional.z.clone()?,
    })
}

pub async fn driver_position(pool: PgPool) -> Option<Vec<db::tables::DriverPosition>> {
    let row = sqlx::query_as!(
        DriverPositionHistory,
        r#"
        select driver_nr,
               last(timestamp, created_at) AS timestamp,
               last(status, created_at) AS status,
               last(x, created_at) AS x,
               last(y, created_at) AS y,
               last(z, created_at) AS z
        from driver_position
        where timestamp notnull and status notnull and x notnull and y notnull and z notnull
        group by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    Some(
        row.ok()?
            .iter()
            .filter_map(|pos| validate_position(pos))
            .collect(),
    )
}

pub struct DriverCarDataHisotry {
    pub driver_nr: String,
    pub timestamp: Option<String>,
    pub rpm: Option<f64>,
    pub speed: Option<f64>,
    pub gear: Option<i64>,
    pub throttle: Option<i64>,
    pub breaks: Option<bool>,
    pub drs: Option<bool>,
}

pub fn validate_car_data(optional: &DriverCarDataHisotry) -> Option<db::tables::DriverCarData> {
    Some(db::tables::DriverCarData {
        driver_nr: optional.driver_nr.clone(),
        timestamp: optional.timestamp.clone()?,
        rpm: optional.rpm,
        speed: optional.speed,
        gear: optional.gear,
        throttle: optional.throttle,
        breaks: optional.breaks,
        drs: optional.drs,
    })
}

pub async fn driver_car_data(pool: PgPool) -> Option<Vec<db::tables::DriverCarData>> {
    let rows = sqlx::query_as!(
        DriverCarDataHisotry,
        r#"
        select driver_nr,
               last(timestamp, created_at) FILTER(WHERE timestamp IS NOT NULL) AS timestamp,
               last(rpm, created_at) FILTER(WHERE rpm IS NOT NULL) AS rpm,
               last(speed, created_at) FILTER(WHERE speed IS NOT NULL) AS speed,
               last(gear, created_at) FILTER(WHERE gear IS NOT NULL) AS gear,
               last(throttle, created_at) FILTER(WHERE throttle IS NOT NULL) AS throttle,
               last(breaks, created_at) FILTER(WHERE breaks IS NOT NULL) AS breaks,
               last(drs, created_at) FILTER(WHERE drs IS NOT NULL) AS drs
        from driver_car_data
        where timestamp notnull
        group by driver_nr;
        "#,
    )
    .fetch_all(&pool)
    .await;

    Some(
        rows.ok()?
            .iter()
            .filter_map(|car| validate_car_data(car))
            .collect(),
    )
}

pub async fn extrapolated_clock(pool: PgPool) -> Option<db::tables::ExtrapolatedClock> {
    let row = sqlx::query_as!(
        db::tables::ExtrapolatedClock,
        r#"
		select
		  	last(extrapolating,created_at) FILTER(WHERE extrapolating IS NOT NULL) AS extrapolating,
		  	last(remaining,created_at) FILTER(WHERE remaining IS NOT NULL) AS remaining,
			last(utc,created_at) FILTER(WHERE utc IS NOT NULL) AS utc
		from extrapolated_clock;
		"#,
    )
    .fetch_one(&pool)
    .await;

    row.ok()
}
