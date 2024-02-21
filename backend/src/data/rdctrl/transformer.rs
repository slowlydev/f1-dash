use std::collections::HashMap;

use serde::de::DeserializeOwned;
use serde_json::Value;

use crate::{
    client::parser::Update,
    db::{self},
};

fn optional_pointer<T: DeserializeOwned>(value: &Value, pointer: &str) -> Option<T> {
    value
        .pointer(pointer)
        .and_then(|v| serde_json::from_value(v.clone()).ok())
}

fn map_or_vec(value: Value) -> Vec<(i64, Value)> {
    match value {
        Value::Object(map) => {
            let vec: Vec<(i64, Value)> = map
                .into_iter()
                .map(|(k, v)| (k.parse().unwrap(), v))
                .collect();
            vec
        }
        Value::Array(arr) => {
            let vec: Vec<(i64, Value)> = arr
                .into_iter()
                .enumerate()
                .map(|(i, v)| (i as i64, v))
                .collect();
            vec
        }
        _ => vec![],
    }
}

fn parse_gap(s: Option<String>) -> Option<i64> {
    let Some(s) = s else {
        return None;
    };

    if s.contains("LAP") {
        return None;
    }

    let parts: Vec<&str> = s.split(&['.'][..]).collect();

    if parts.len() < 2 {
        return None;
    }

    let seconds: i64 = parts[0].parse().unwrap_or(0);
    let milliseconds: i64 = parts[1].parse().unwrap_or(0);

    Some(seconds * 1_000 + milliseconds)
}

fn parse_sector(s: Option<String>) -> Option<i64> {
    let Some(s) = s else {
        return None;
    };

    let parts: Vec<&str> = s.split(&['.'][..]).collect();

    if parts.len() < 2 {
        return None;
    }

    let seconds: i64 = parts[0].parse().unwrap_or(0);
    let milliseconds: i64 = parts[1].parse().unwrap_or(0);

    Some(seconds * 1_000 + milliseconds)
}

fn parse_lap(s: Option<String>) -> Option<i64> {
    let Some(s) = s else {
        return None;
    };

    let parts: Vec<&str> = s.split(&[':', '.'][..]).collect();

    if parts.len() < 3 {
        return None;
    }

    let minutes: i64 = parts[0].parse().unwrap_or(0);
    let seconds: i64 = parts[1].parse().unwrap_or(0);
    let milliseconds: i64 = parts[2].parse().unwrap_or(0);

    Some(minutes * 60_000 + seconds * 1_000 + milliseconds)
}

fn parse_laps(s: Option<String>) -> Option<i64> {
    if let Some(s) = s {
        if s.contains("LAP") {
            let chars: Vec<&str> = s.split("").collect();
            return chars[0].parse::<i64>().ok();
        }
    }

    None
}

#[derive(Debug, Clone)]
pub enum TableUpdate {
    Weather(db::tables::Weather),
    ExtrapolatedClock(db::tables::ExtrapolatedClock),
    LapCount(db::tables::LapCount),
    TeamRadio(Vec<db::tables::TeamRadio>),
    RaceControlMessages(Vec<db::tables::RaceControlMessages>),
    GeneralTiming(db::tables::GeneralTiming),
    DriverTiming(Vec<db::tables::DriverTiming>),
    DriverSector(Vec<db::tables::DriverSector>),
    DriverSectorSegment(Vec<db::tables::DriverSectorSegment>),
    DriverStint(Vec<db::tables::DriverStint>),
    Driver(Vec<db::tables::Driver>),
    DriverStats(Vec<db::tables::DriverStats>),
    DriverSectorStats(Vec<db::tables::DriverSectorStats>),
    DriverSpeeds(Vec<db::tables::DriverSpeeds>),
}

pub fn parse_updates(updates: Vec<Update>) -> Vec<TableUpdate> {
    let mut vec: Vec<TableUpdate> = Vec::new();

    for update in updates {
        match update.category.as_str() {
            "WeatherData" => {
                let weather = parse_weather(update.state);
                if !weather.is_empty() {
                    vec.push(TableUpdate::Weather(weather));
                }
            }
            "ExtrapolatedClock" => {
                vec.push(TableUpdate::ExtrapolatedClock(parse_extrapolated_clock(
                    update.state,
                )));
            }
            "LapCount" => {
                vec.push(TableUpdate::LapCount(parse_lap_count(update.state)));
            }
            "TeamRadio" => {
                vec.push(TableUpdate::TeamRadio(parse_team_radio(update.state)));
            }
            "RaceControlMessages" => {
                vec.push(TableUpdate::RaceControlMessages(
                    parse_race_control_messages(update.state),
                ));
            }
            "TimingData" => {
                let general_timing = parse_general_timing(update.state.clone());
                if !general_timing.is_empty() {
                    vec.push(TableUpdate::GeneralTiming(general_timing));
                }

                vec.push(TableUpdate::DriverTiming(parse_driver_timing(
                    update.state.clone(),
                )));
                vec.push(TableUpdate::DriverSector(parse_driver_sector(
                    update.state.clone(),
                )));
                vec.push(TableUpdate::DriverSpeeds(parse_driver_speed(
                    update.state.clone(),
                )));
                vec.push(TableUpdate::DriverSectorSegment(
                    parse_driver_sector_segment(update.state),
                ));
            }
            "TimingAppData" => {
                vec.push(TableUpdate::DriverStint(parse_driver_stint(update.state)));
            }
            "DriverList" => {
                vec.push(TableUpdate::Driver(parse_driver(update.state)));
            }
            "TimingStats" => {
                vec.push(TableUpdate::DriverStats(parse_driver_stats(
                    update.state.clone(),
                )));
                vec.push(TableUpdate::DriverSectorStats(parse_driver_sector_stats(
                    update.state,
                )));
            }
            _ => {}
        }
    }

    vec
}

pub fn parse_initial(initial: Value) -> Vec<TableUpdate> {
    let mut vec: Vec<TableUpdate> = Vec::new();

    if let Value::Object(map) = initial {
        for (k, v) in map {
            match k.as_str() {
                "WeatherData" => {
                    let weather = parse_weather(v);
                    if !weather.is_empty() {
                        vec.push(TableUpdate::Weather(weather));
                    }
                }
                "ExtrapolatedClock" => {
                    vec.push(TableUpdate::ExtrapolatedClock(parse_extrapolated_clock(v)));
                }
                "LapCount" => {
                    vec.push(TableUpdate::LapCount(parse_lap_count(v)));
                }
                "TeamRadio" => {
                    vec.push(TableUpdate::TeamRadio(parse_team_radio(v)));
                }
                "RaceControlMessages" => {
                    vec.push(TableUpdate::RaceControlMessages(
                        parse_race_control_messages(v),
                    ));
                }
                "TimingData" => {
                    let general_timing = parse_general_timing(v.clone());
                    if !general_timing.is_empty() {
                        vec.push(TableUpdate::GeneralTiming(general_timing));
                    }

                    vec.push(TableUpdate::DriverTiming(parse_driver_timing(v.clone())));
                    vec.push(TableUpdate::DriverSector(parse_driver_sector(v.clone())));
                    vec.push(TableUpdate::DriverSpeeds(parse_driver_speed(v.clone())));
                    vec.push(TableUpdate::DriverSectorSegment(
                        parse_driver_sector_segment(v),
                    ));
                }
                "TimingAppData" => {
                    vec.push(TableUpdate::DriverStint(parse_driver_stint(v)));
                }
                "DriverList" => {
                    vec.push(TableUpdate::Driver(parse_driver(v)));
                }
                "TimingStats" => {
                    vec.push(TableUpdate::DriverStats(parse_driver_stats(v.clone())));
                    vec.push(TableUpdate::DriverSectorStats(parse_driver_sector_stats(v)));
                }
                _ => {}
            }
        }
    }

    vec
}

// ! - parsers bellow - !

fn parse_weather(value: Value) -> db::tables::Weather {
    db::tables::Weather {
        humidity: value
            .pointer("/Humidity")
            .and_then(|v| serde_json::from_value::<String>(v.clone()).ok())
            .and_then(|v| v.parse::<f64>().ok()),
        pressure: value
            .pointer("/Pressure")
            .and_then(|v| serde_json::from_value::<String>(v.clone()).ok())
            .and_then(|v| v.parse::<f64>().ok()),
        rainfall: value
            .pointer("/Rainfall")
            .and_then(|v| serde_json::from_value::<String>(v.clone()).ok())
            .and_then(|v| Some(v == "1")),
        wind_direction: value
            .pointer("/WindDirection")
            .and_then(|v| serde_json::from_value::<String>(v.clone()).ok())
            .and_then(|v| v.parse::<i64>().ok()),
        wind_speed: value
            .pointer("/WindSpeed")
            .and_then(|v| serde_json::from_value::<String>(v.clone()).ok())
            .and_then(|v| v.parse::<f64>().ok()),
        air_temp: value
            .pointer("/AirTemp")
            .and_then(|v| serde_json::from_value::<String>(v.clone()).ok())
            .and_then(|v| v.parse::<f64>().ok()),
        track_temp: value
            .pointer("/TrackTemp")
            .and_then(|v| serde_json::from_value::<String>(v.clone()).ok())
            .and_then(|v| v.parse::<f64>().ok()),
    }
}

fn parse_extrapolated_clock(value: Value) -> db::tables::ExtrapolatedClock {
    db::tables::ExtrapolatedClock {
        extrapolating: optional_pointer(&value, "/Extrapolating"),
        remaining: optional_pointer(&value, "/Remaining"),
        utc: optional_pointer(&value, "/Utc"),
    }
}

fn parse_lap_count(value: Value) -> db::tables::LapCount {
    db::tables::LapCount {
        current: optional_pointer(&value, "/CurrentLap"),
        total: optional_pointer(&value, "/TotalLaps"),
    }
}

fn parse_driver_stats(value: Value) -> Vec<db::tables::DriverStats> {
    let map: Option<HashMap<String, Value>> = optional_pointer(&value, "/Lines");

    let mut vec: Vec<db::tables::DriverStats> = Vec::new();

    if let Some(map) = map {
        for (k, v) in map {
            let driver_stats = db::tables::DriverStats {
                driver_nr: k,
                lap: optional_pointer(&v, "/PersonalBestLapTime/Lap"),
                pb_lap_time: parse_lap(optional_pointer(&v, "/PersonalBestLapTime/Value")),
                pb_lap_time_pos: optional_pointer(&v, "/PersonalBestLapTime/Position"),
            };

            if !driver_stats.is_empty() {
                vec.push(driver_stats);
            }
        }
    }

    vec
}

fn parse_driver_sector_stats(value: Value) -> Vec<db::tables::DriverSectorStats> {
    let map: Option<HashMap<String, Value>> = optional_pointer(&value, "/Lines");

    let mut vec: Vec<db::tables::DriverSectorStats> = Vec::new();

    if let Some(map) = map {
        for (driver_nr, v) in map {
            let sectors = v.pointer("/BestSectors");

            if let Some(sectors) = sectors {
                for (number, sector) in map_or_vec(sectors.clone()) {
                    let driver_stats = db::tables::DriverSectorStats {
                        driver_nr: driver_nr.clone(),
                        number,
                        value: parse_sector(optional_pointer(&sector, "/Value")),
                        position: optional_pointer(&sector, "/Position"),
                    };

                    if !driver_stats.is_empty() {
                        vec.push(driver_stats);
                    }
                }
            }
        }
    }

    vec
}

fn parse_driver_speed(value: Value) -> Vec<db::tables::DriverSpeeds> {
    let map: Option<HashMap<String, Value>> = optional_pointer(&value, "/Lines");

    let mut vec: Vec<db::tables::DriverSpeeds> = Vec::new();

    if let Some(map) = map {
        for (driver_nr, driver_v) in map {
            let speeds: Option<HashMap<String, Value>> = optional_pointer(&driver_v, "/Speeds");

            if let Some(speeds) = speeds {
                for (station, speed) in speeds {
                    let driver_speeds = db::tables::DriverSpeeds {
                        driver_nr: driver_nr.clone(),
                        station,
                        value: optional_pointer(&speed, "/Value"),
                        status: optional_pointer(&speed, "/Status"),
                        overall_fastest: optional_pointer(&speed, "/OverallFastest"),
                        personal_fastest: optional_pointer(&speed, "/PersonalFastest"),
                    };

                    if !driver_speeds.is_empty() {
                        vec.push(driver_speeds);
                    }
                }
            }
        }
    }

    vec
}

fn parse_driver(value: Value) -> Vec<db::tables::Driver> {
    let mut vec: Vec<db::tables::Driver> = Vec::new();

    if let Value::Object(map) = value {
        for (k, v) in map {
            let driver = db::tables::Driver {
                driver_nr: k,
                line: optional_pointer(&v, "/Line"),
                full_name: optional_pointer(&v, "/FullName"),
                first_name: optional_pointer(&v, "/FirstName"),
                last_name: optional_pointer(&v, "/LastName"),
                short: optional_pointer(&v, "/Tla"),
                country: optional_pointer(&v, "/CountryCode"),
                team_name: optional_pointer(&v, "/TeamName"),
                team_color: optional_pointer(&v, "/TeamColour"),
                picture: optional_pointer(&v, "/HeadshotUrl"),
            };

            if !driver.is_empty() {
                vec.push(driver);
            }
        }
    }

    vec
}

fn parse_team_radio(value: Value) -> Vec<db::tables::TeamRadio> {
    let captures = value.pointer("/Captures");

    let mut vec: Vec<db::tables::TeamRadio> = Vec::new();

    if let Some(captures) = captures {
        for (_, v) in map_or_vec(captures.clone()) {
            let team_radio = db::tables::TeamRadio {
                utc: optional_pointer(&v, "/Utc"),
                driver_nr: optional_pointer(&v, "/RacingNumber"),
                url: optional_pointer(&v, "/Path"),
            };

            vec.push(team_radio);
        }
    }

    vec
}

fn parse_race_control_messages(value: Value) -> Vec<db::tables::RaceControlMessages> {
    let messages = value.pointer("/Messages");

    let mut vec: Vec<db::tables::RaceControlMessages> = Vec::new();

    if let Some(messages) = messages {
        for (_, message) in map_or_vec(messages.clone()) {
            let race_control_message = db::tables::RaceControlMessages {
                utc: optional_pointer(&message, "/Utc"),
                lap: optional_pointer(&message, "/Laps"),
                message: optional_pointer(&message, "/Message"),
                category: optional_pointer(&message, "/Category"),
                flag: optional_pointer(&message, "/Flag"),
                scope: optional_pointer(&message, "/Scope"),
                sector: optional_pointer(&message, "/Sector"),
                drs_enabled: None, // TODO make this work
            };

            vec.push(race_control_message);
        }
    }

    vec
}

fn parse_general_timing(value: Value) -> db::tables::GeneralTiming {
    db::tables::GeneralTiming {
        no_entries: optional_pointer(&value, "/NoEntries"),
        session_part: optional_pointer(&value, "/NoEntries"),
        cut_off_time: optional_pointer(&value, "/CutOffTime"),
        cut_off_percentage: optional_pointer(&value, "/CutOffPercentage"),
    }
}

fn parse_driver_timing(value: Value) -> Vec<db::tables::DriverTiming> {
    let map: Option<HashMap<String, Value>> = optional_pointer(&value, "/Lines");

    let mut vec: Vec<db::tables::DriverTiming> = Vec::new();

    if let Some(map) = map {
        for (k, v) in map {
            let driver_timing = db::tables::DriverTiming {
                driver_nr: k,
                line: optional_pointer(&v, "/Line"),
                position: optional_pointer(&v, "/Position"),
                show_position: optional_pointer(&v, "/ShowPosition"),
                gap_to_leader: parse_gap(optional_pointer(&v, "/GapToLeader")),
                gap_to_ahead: parse_gap(optional_pointer(&v, "/IntervalToPositionAhead/Value")),
                gap_to_leader_laps: parse_laps(optional_pointer(&v, "/GapToLeader")),
                gap_to_ahead_laps: parse_laps(optional_pointer(
                    &v,
                    "/IntervalToPositionAhead/Value",
                )),
                catching_ahead: optional_pointer(&v, "/IntervalToPositionAhead/Catching"),
                lap_time: parse_lap(optional_pointer(&v, "/LastLapTime/Value")),
                lap_time_fastest: optional_pointer(&v, "/LastLapTime/OverallFastest"),
                lap_time_pb: optional_pointer(&v, "/LastLapTime/PersonalFastest"),
                number_of_laps: optional_pointer(&v, "/NumberOfLaps"),
                number_of_pit_stops: optional_pointer(&v, "/NumberOfPitStops"),
                status: optional_pointer(&v, "/Status"),
                retired: optional_pointer(&v, "/Retired"),
                in_pit: optional_pointer(&v, "/InPit"),
                pit_out: optional_pointer(&v, "/PitOut"),
                knocked_out: optional_pointer(&v, "/KnockedOut"),
                stopped: optional_pointer(&v, "/Stopped"),
            };

            if !driver_timing.is_empty() {
                vec.push(driver_timing);
            }
        }
    }

    vec
}

fn parse_driver_sector(value: Value) -> Vec<db::tables::DriverSector> {
    let map: Option<HashMap<String, Value>> = optional_pointer(&value, "/Lines");

    let mut vec: Vec<db::tables::DriverSector> = Vec::new();

    if let Some(map) = map {
        for (driver_nr, driver_v) in map {
            let sectors = driver_v.pointer("/Sectors");

            if let Some(sectors) = sectors {
                for (i, sector) in map_or_vec(sectors.clone()) {
                    let driver_sector = db::tables::DriverSector {
                        driver_nr: driver_nr.clone(),
                        number: i,
                        time: parse_sector(optional_pointer(&sector, "/Value")),
                        previous_time: parse_sector(optional_pointer(&sector, "/PreviousValue")),
                        status: optional_pointer(&sector, "/Status"),
                        stopped: optional_pointer(&sector, "/Stopped"),
                        overall_fastest: optional_pointer(&sector, "/OverallFastest"),
                        personal_fastest: optional_pointer(&sector, "/PersonalFastest"),
                    };

                    if !driver_sector.is_empty() {
                        vec.push(driver_sector);
                    }
                }
            }
        }
    }

    vec
}

fn parse_driver_sector_segment(value: Value) -> Vec<db::tables::DriverSectorSegment> {
    let map: Option<HashMap<String, Value>> = optional_pointer(&value, "/Lines");

    let mut vec: Vec<db::tables::DriverSectorSegment> = Vec::new();

    if let Some(map) = map {
        for (driver_nr, driver_v) in map {
            let sectors = driver_v.pointer("/Sectors");

            if let Some(sectors) = sectors {
                for (sector_nr, sector_v) in map_or_vec(sectors.clone()) {
                    let segments = sector_v.pointer("/Segments");

                    if let Some(segments) = segments {
                        for (segment_nr, segment_v) in map_or_vec(segments.clone()) {
                            let driver_sector_segment = db::tables::DriverSectorSegment {
                                driver_nr: driver_nr.clone(),
                                sector_number: sector_nr.clone(),
                                number: segment_nr,
                                status: optional_pointer(&segment_v, "/Status"),
                            };

                            if !driver_sector_segment.is_empty() {
                                vec.push(driver_sector_segment);
                            }
                        }
                    }
                }
            }
        }
    }

    vec
}

fn parse_driver_stint(value: Value) -> Vec<db::tables::DriverStint> {
    let map: Option<HashMap<String, Value>> = optional_pointer(&value, "/Lines");

    let mut vec: Vec<db::tables::DriverStint> = Vec::new();

    if let Some(map) = map {
        for (driver_nr, driver_v) in map {
            let stints = driver_v.pointer("/Stints");

            if let Some(stints) = stints {
                for (stint_nr, v) in map_or_vec(stints.clone()) {
                    let driver_stint = db::tables::DriverStint {
                        driver_nr: driver_nr.clone(),
                        stint_nr,
                        lap_flags: optional_pointer(&v, "/LapFlags"),
                        compound: optional_pointer(&v, "/Compound"),
                        new: optional_pointer(&v, "/New"),
                        tires_not_changed: optional_pointer(&v, "/TiresNotChanged"),
                        total_laps: optional_pointer(&v, "/TotalLaps"),
                        start_laps: optional_pointer(&v, "/StartLaps"),
                        lap_time: parse_lap(optional_pointer(&v, "/LapTime")),
                        lap_number: optional_pointer(&v, "/LapNumber"),
                    };

                    if !driver_stint.is_empty() {
                        vec.push(driver_stint);
                    }
                }
            }
        }
    }

    vec
}
