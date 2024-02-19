use sqlx::PgPool;

use super::tables;

pub async fn session_status(pool: PgPool, session_status: tables::SessionStatus) {
    let _ = sqlx::query!(
        r#"insert into session_status (utc, track_status, session_status) values ($1, $2, $3)"#,
        session_status.utc,
        session_status.track_status,
        session_status.session_status
    )
    .execute(&pool)
    .await;
}

pub async fn lap_count(pool: PgPool, lap_count: tables::LapCount) {
    let _ = sqlx::query!(
        r#"insert into lap_count (current, total) values ($1, $2)"#,
        lap_count.current,
        lap_count.total,
    )
    .execute(&pool)
    .await;
}

pub async fn weather(pool: PgPool, weather: tables::Weather) {
    let _ = sqlx::query!(
        r#"insert into weather (humidity, pressure, rainfall, wind_direction, wind_speed, air_temp, track_temp)
        values ($1, $2, $3, $4, $5, $6, $7)"#,
        weather.humidity,
        weather.pressure,
        weather.rainfall,
        weather.wind_direction,
        weather.wind_speed,
        weather.air_temp,
        weather.track_temp
    )
    .execute(&pool)
    .await;
}

pub async fn extrapolated_clock(pool: PgPool, extrapolated_clock: tables::ExtrapolatedClock) {
    let _ = sqlx::query!(
        r#"insert into extrapolated_clock (extrapolating, remaining, utc) values ($1, $2, $3)"#,
        extrapolated_clock.extrapolating,
        extrapolated_clock.remaining,
        extrapolated_clock.utc,
    )
    .execute(&pool)
    .await;
}

pub async fn race_control_messages(pool: PgPool, rc_msgs: tables::RaceControlMessages) {
    let _ = sqlx::query!(
        r#"insert into race_control_messages (utc, lap, message, category, flag, scope, sector, drs_enabled)
        values ($1, $2, $3, $4, $5, $6, $7, $8)"#,
        rc_msgs.utc,
        rc_msgs.lap,
        rc_msgs.message,
        rc_msgs.category,
        rc_msgs.flag,
        rc_msgs.scope,
        rc_msgs.sector,
        rc_msgs.drs_enabled
    )
    .execute(&pool)
    .await;
}

pub async fn team_radio(pool: PgPool, team_radio: tables::TeamRadio) {
    let _ = sqlx::query!(
        r#"insert into team_radio (utc, driver_nr, url) values ($1, $2, $3)"#,
        team_radio.utc,
        team_radio.driver_nr,
        team_radio.url
    )
    .execute(&pool)
    .await;
}

pub async fn general_timing(pool: PgPool, general_timing: tables::GeneralTiming) {
    let _ = sqlx::query!(
        r#"insert into general_timing (no_entries, session_part, cut_off_time, cut_off_percentage) values ($1, $2, $3, $4)"#,
        general_timing.no_entries.as_deref(),
        general_timing.session_part,
        general_timing.cut_off_time,
        general_timing.cut_off_percentage
    )
    .execute(&pool)
    .await;
}

pub async fn driver(pool: PgPool, driver: tables::Driver) {
    let _ = sqlx::query!(
        r#"insert into driver
        (driver_nr, full_name, first_name, last_name, short, country, line, team_name, team_color)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)"#,
        driver.driver_nr,
        driver.full_name,
        driver.first_name,
        driver.last_name,
        driver.short,
        driver.country,
        driver.line,
        driver.team_name,
        driver.team_color
    )
    .execute(&pool)
    .await;
}

pub async fn driver_timing(pool: PgPool, driver_timing: tables::DriverTiming) {
    let _ = sqlx::query!(
        r#"insert into driver_timing
        (driver_nr, line, position, show_position, gap_to_leader, gap_to_ahead, catching_ahead, lap_time, lap_time_fastest, lap_time_pb, number_of_laps, number_of_pit_stops, status, retired, in_pit, pit_out, knocked_out, stopped)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)"#,
        driver_timing.driver_nr,
        driver_timing.line,
        driver_timing.position,
        driver_timing.show_position,
        driver_timing.gap_to_leader,
        driver_timing.gap_to_ahead,
        driver_timing.catching_ahead,
        driver_timing.lap_time,
        driver_timing.lap_time_fastest,
        driver_timing.lap_time_pb,
        driver_timing.number_of_laps,
        driver_timing.number_of_pit_stops,
        driver_timing.status,
        driver_timing.retired,
        driver_timing.in_pit,
        driver_timing.pit_out,
        driver_timing.knocked_out,
        driver_timing.stopped
    )
    .execute(&pool)
    .await;
}

pub async fn driver_sector(pool: PgPool, driver_sector: tables::DriverSector) {
    let _ = sqlx::query!(
        r#"insert into driver_sector (driver_nr, number, time, previous_time, status, stopped, overall_fastest, personal_fastest)
        values ($1, $2, $3, $4, $5, $6, $7, $8)"#,
        driver_sector.driver_nr,
        driver_sector.number,
        driver_sector.time,
        driver_sector.previous_time,
        driver_sector.status,
        driver_sector.stopped,
        driver_sector.overall_fastest,
        driver_sector.personal_fastest,
    )
    .execute(&pool)
    .await;
}

pub async fn driver_sector_segment(
    pool: PgPool,
    driver_sector_segment: tables::DriverSectorSegment,
) {
    let _ = sqlx::query!(
        r#"insert into driver_sector_segment (driver_nr, sector_number, number, status)
        values ($1, $2, $3, $4)"#,
        driver_sector_segment.driver_nr,
        driver_sector_segment.sector_number,
        driver_sector_segment.number,
        driver_sector_segment.status,
    )
    .execute(&pool)
    .await;
}

pub async fn driver_stint(pool: PgPool, driver_stint: tables::DriverStint) {
    let _ = sqlx::query!(
        r#"insert into driver_stints (driver_nr, stint_nr, lap_flags, compound, new, tires_not_changed, total_laps, start_laps, lap_time, lap_number)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"#,
        driver_stint.driver_nr,
        driver_stint.stint_nr,
        driver_stint.lap_flags,
        driver_stint.compound,
        driver_stint.new,
        driver_stint.tires_not_changed,
        driver_stint.total_laps,
        driver_stint.start_laps,
        driver_stint.lap_time,
        driver_stint.lap_number
    )
    .execute(&pool)
    .await;
}

pub async fn driver_speeds(pool: PgPool, driver_speeds: tables::DriverSpeeds) {
    let _ = sqlx::query!(
        r#"insert into driver_speeds (driver_nr, station, value, status, overall_fastest, personal_fastest)
        values ($1, $2, $3, $4, $5, $6)"#,
        driver_speeds.driver_nr,
        driver_speeds.station,
        driver_speeds.value,
        driver_speeds.status,
        driver_speeds.overall_fastest,
        driver_speeds.personal_fastest,
    )
    .execute(&pool)
    .await;
}

pub async fn driver_stats(pool: PgPool, driver_stats: tables::DriverStats) {
    let _ = sqlx::query!(
        r#"insert into driver_stats (driver_nr, pb_lap_time, pb_lap_time_pos)
        values ($1, $2, $3)"#,
        driver_stats.driver_nr,
        driver_stats.pb_lap_time,
        driver_stats.pb_lap_time_pos
    )
    .execute(&pool)
    .await;
}

pub async fn driver_sector_stats(pool: PgPool, driver_sector_stats: tables::DriverSectorStats) {
    let _ = sqlx::query!(
        r#"insert into driver_sector_stats (driver_nr, number, value, position)
        values ($1, $2, $3, $4)"#,
        driver_sector_stats.driver_nr,
        driver_sector_stats.number,
        driver_sector_stats.value,
        driver_sector_stats.position
    )
    .execute(&pool)
    .await;
}

pub async fn driver_position(pool: PgPool, driver_position: tables::DriverPosition) {
    let _ = sqlx::query!(
        r#"insert into driver_position (driver_nr, timestamp, status, x, y, z)
        values ($1, $2, $3, $4, $5, $6)"#,
        driver_position.driver_nr,
        driver_position.timestamp,
        driver_position.status,
        driver_position.x,
        driver_position.y,
        driver_position.z,
    )
    .execute(&pool)
    .await;
}

pub async fn driver_car_data(pool: PgPool, driver_cat_data: tables::DriverCarData) {
    let _ = sqlx::query!(
        r#"insert into driver_car_data (driver_nr, timestamp, rpm, speed, gear, throttle, breaks, drs)
        values ($1, $2, $3, $4, $5, $6, $7, $8)"#,
        driver_cat_data.driver_nr,
        driver_cat_data.timestamp,
        driver_cat_data.rpm,
        driver_cat_data.speed,
        driver_cat_data.gear,
        driver_cat_data.throttle,
        driver_cat_data.breaks,
        driver_cat_data.drs
    )
    .execute(&pool)
    .await;
}
