use serde_json::Value;
use timescale::{app_timing::TireDriver, timing::TimingDriver};
use tracing::trace;

use crate::models::{TimingAppDataDriver, TimingDataDriver};

// "LAP1" / "" / "+0.273" / "1L" / "20L"
pub fn parse_gap(gap: String) -> i64 {
    if gap.is_empty() {
        trace!(gap, "gap empty");
        return 0;
    }
    if gap.contains("L") {
        trace!(gap, "gap contains L");
        return 0;
    }
    if let Ok(ms) = gap.replace("+", "").parse::<f64>() {
        trace!(gap, ms, "gap parsed");
        return (ms * 1000.0) as i64;
    }

    trace!(gap, "gap failed to parse");

    return 0;
}

// "1:21.306" / ""
pub fn parse_laptime(lap: String) -> i64 {
    if lap.is_empty() {
        trace!(lap, "laptime empty");
        return 0;
    }
    let parts: Vec<&str> = lap.split(':').collect();
    if parts.len() == 2 {
        if let (Ok(minutes), Ok(seconds)) = (parts[0].parse::<i64>(), parts[1].parse::<f64>()) {
            trace!(lap, "laptime parsed");
            return minutes * 60_000 + (seconds * 1000.0) as i64;
        }
    }
    trace!(lap, "laptime failed to parse");
    return 0;
}

// "26.259" / ""
pub fn parse_sector(sector: String) -> i64 {
    if sector.is_empty() {
        trace!(sector, "sector empty");
        return 0;
    }
    if let Ok(seconds) = sector.parse::<f64>() {
        trace!(sector, "sector parsed");
        return (seconds * 1000.0) as i64;
    }
    trace!(sector, "sector failed to parse");
    return 0;
}

fn str_pointer<'a>(update: Option<&'a Value>, pointer: &str) -> Option<&'a str> {
    update
        .and_then(|v| v.pointer(pointer))
        .and_then(|v| v.as_str())
}

pub fn parse_timing_driver(
    nr: &String,
    lap: Option<i32>,
    driver: &TimingDataDriver,
    update: Option<&Value>,
) -> Option<TimingDriver> {
    let gap = str_pointer(update, "/intervalToPositionAhead/value");
    let leader_gap = str_pointer(update, "/gapToLeader");

    let laptime = str_pointer(update, "/lastLaptime/value");

    let sector_1 = str_pointer(update, "/sectors/0/value");
    let sector_2 = str_pointer(update, "/sectors/1/value");
    let sector_3 = str_pointer(update, "/sectors/2/value");

    if gap.is_some()
        || leader_gap.is_some()
        || laptime.is_some()
        || sector_1.is_some()
        || sector_2.is_some()
        || sector_3.is_some()
    {
        return None;
    }

    Some(TimingDriver {
        nr: nr.clone(),
        lap,
        gap: parse_gap(
            gap.unwrap_or(&driver.interval_to_position_ahead.as_ref().unwrap().value)
                .to_string(),
        ),
        leader_gap: parse_gap(leader_gap.unwrap_or(&driver.gap_to_leader).to_string()),
        laptime: parse_laptime(laptime.unwrap_or(&driver.last_lap_time.value).to_string()),
        sector_1: parse_sector(sector_1.unwrap_or(&driver.sectors[0].value).to_string()),
        sector_2: parse_sector(sector_2.unwrap_or(&driver.sectors[1].value).to_string()),
        sector_3: parse_sector(sector_3.unwrap_or(&driver.sectors[2].value).to_string()),
    })
}

pub fn parse_tire_driver(
    nr: &String,
    lap: Option<i32>,
    driver: &TimingAppDataDriver,
    update: Option<&Value>,
) -> Option<TireDriver> {
    let update_stint = update
        .and_then(|v| v.pointer("/stints"))
        .and_then(|v| v.as_array())
        .and_then(|v| v.last());

    let last_stint = driver.stints.last();

    let compound = update_stint
        .and_then(|v| v.get("compound"))
        .and_then(|v| v.as_str());

    let laps = update_stint
        .and_then(|v| v.get("totalLaps"))
        .and_then(|v| v.as_i64());

    if compound.is_some() || laps.is_some() {
        return None;
    }

    Some(TireDriver {
        nr: nr.clone(),
        lap,
        compound: compound
            .unwrap_or(last_stint.unwrap().compound.as_ref().unwrap())
            .to_string(),
        laps: laps.unwrap_or(last_stint.unwrap().total_laps.unwrap().clone() as i64) as i32,
    })
}
