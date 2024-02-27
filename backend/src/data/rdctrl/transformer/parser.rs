use std::collections::HashMap;

use serde::de::DeserializeOwned;
use serde_json::Value;

use crate::db;

use super::inflate;

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

pub fn parse_session_info(value: Value) -> Option<db::tables::SessionInfo> {
    let session_info = db::tables::SessionInfo {
        key: optional_pointer(&value, "/Key"),
        kind: optional_pointer(&value, "/Type"),
        name: optional_pointer(&value, "/Name"),
        start_date: optional_pointer(&value, "/StartDate"),
        end_date: optional_pointer(&value, "/EndDate"),
        gmt_offset: optional_pointer(&value, "/GmtOffset"),
        path: optional_pointer(&value, "/Path"),
        number: optional_pointer(&value, "/Number"),
    };

    if !session_info.is_empty() {
        Some(session_info)
    } else {
        None
    }
}

pub fn parse_track_status(value: Value) -> Option<db::tables::TrackStatus> {
    let track_status = db::tables::TrackStatus {
        status: optional_pointer(&value, "/Status"),
        message: optional_pointer(&value, "/Message"),
    };

    if !track_status.is_empty() {
        Some(track_status)
    } else {
        None
    }
}

pub fn parse_meeting(value: Value) -> Option<db::tables::Meeting> {
    let meeting = db::tables::Meeting {
        key: optional_pointer(&value, "/Meeting/Key"),
        name: optional_pointer(&value, "/Meeting/Name"),
        official_name: optional_pointer(&value, "/Meeting/OfficialName"),
        location: optional_pointer(&value, "/Meeting/Location"),
        country_key: optional_pointer(&value, "/Meeting/Country/Key"),
        country_code: optional_pointer(&value, "/Meeting/Country/Code"),
        country_name: optional_pointer(&value, "/Meeting/Country/Name"),
        circuit_key: optional_pointer(&value, "/Meeting/Circuit/Key"),
        circuit_name: optional_pointer(&value, "/Meeting/Circuit/ShortName"),
    };

    if !meeting.is_empty() {
        Some(meeting)
    } else {
        None
    }
}

pub fn parse_weather(value: Value) -> Option<db::tables::Weather> {
    let weather = db::tables::Weather {
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
    };

    if !weather.is_empty() {
        Some(weather)
    } else {
        None
    }
}

pub fn parse_extrapolated_clock(value: Value) -> Option<db::tables::ExtrapolatedClock> {
    let extrapolated_clock = db::tables::ExtrapolatedClock {
        extrapolating: optional_pointer(&value, "/Extrapolating"),
        remaining: optional_pointer(&value, "/Remaining"),
        utc: optional_pointer(&value, "/Utc"),
    };

    if !extrapolated_clock.is_empty() {
        Some(extrapolated_clock)
    } else {
        None
    }
}

pub fn parse_lap_count(value: Value) -> Option<db::tables::LapCount> {
    let lap_count = db::tables::LapCount {
        current: optional_pointer(&value, "/CurrentLap"),
        total: optional_pointer(&value, "/TotalLaps"),
    };

    if !lap_count.is_empty() {
        Some(lap_count)
    } else {
        None
    }
}

pub fn parse_driver_stats(value: Value) -> Vec<db::tables::DriverStats> {
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

pub fn parse_driver_sector_stats(value: Value) -> Vec<db::tables::DriverSectorStats> {
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

pub fn parse_driver_speed(value: Value) -> Vec<db::tables::DriverSpeeds> {
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

pub fn parse_driver(value: Value) -> Vec<db::tables::Driver> {
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

pub fn parse_team_radio(value: Value) -> Vec<db::tables::TeamRadio> {
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

pub fn parse_race_control_messages(value: Value) -> Vec<db::tables::RaceControlMessages> {
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

pub fn parse_general_timing(value: Value) -> Option<db::tables::GeneralTiming> {
    let general_timing = db::tables::GeneralTiming {
        no_entries: optional_pointer(&value, "/NoEntries"),
        session_part: optional_pointer(&value, "/NoEntries"),
        cut_off_time: optional_pointer(&value, "/CutOffTime"),
        cut_off_percentage: optional_pointer(&value, "/CutOffPercentage"),
    };

    if !general_timing.is_empty() {
        Some(general_timing)
    } else {
        None
    }
}

pub fn parse_driver_timing(value: Value) -> Vec<db::tables::DriverTiming> {
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

pub fn parse_driver_sector(value: Value) -> Vec<db::tables::DriverSector> {
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

pub fn parse_driver_sector_segment(value: Value) -> Vec<db::tables::DriverSectorSegment> {
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

pub fn parse_driver_stint(value: Value) -> Vec<db::tables::DriverStint> {
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

pub fn parse_car_data(string_value: Value) -> Vec<db::tables::DriverCarData> {
    let value = inflate::zlib::<Value, Value>(string_value);

    let mut vec: Vec<db::tables::DriverCarData> = Vec::new();

    if let Ok(value) = value {
        let entries = value.pointer("/Entries");

        if let Some(Value::Array(entries)) = entries {
            for entry in entries {
                let timestamp: Option<String> = optional_pointer(&entry, "/Utc");

                if let Some(timestamp) = timestamp {
                    let cars: Option<HashMap<String, Value>> = optional_pointer(&entry, "/Cars");

                    if let Some(cars) = cars {
                        for (driver_nr, v) in cars {
                            let car_data = db::tables::DriverCarData {
                                driver_nr,
                                timestamp: timestamp.clone(),
                                rpm: optional_pointer(&v, "/Channels/0"),
                                speed: optional_pointer(&v, "/Channels/2"),
                                gear: optional_pointer(&v, "/Channels/3"),
                                throttle: optional_pointer(&v, "/Channels/4"),
                                breaks: optional_pointer(&v, "/Channels/5"),
                                drs: optional_pointer(&v, "/Channels/45"),
                            };

                            if !car_data.is_empty() {
                                vec.push(car_data);
                            }
                        }
                    }
                }
            }
        }

        // car_data
    }

    vec
}

pub fn parse_position(string_value: Value) -> Vec<db::tables::DriverPosition> {
    let value = inflate::zlib::<Value, Value>(string_value);

    let mut vec: Vec<db::tables::DriverPosition> = Vec::new();

    if let Ok(value) = value {
        let positions = value.pointer("/Position");

        if let Some(Value::Array(positions)) = positions {
            for position in positions {
                let timestamp: Option<String> = optional_pointer(&position, "/Timestamp");

                if let Some(timestamp) = timestamp {
                    let entries: Option<HashMap<String, Value>> =
                        optional_pointer(&position, "/Entries");

                    if let Some(entries) = entries {
                        for (driver_nr, v) in entries {
                            let Some(status) = optional_pointer::<String>(&v, "/Status") else {
                                continue;
                            };
                            let Some(x) = optional_pointer::<f64>(&v, "/X") else {
                                continue;
                            };
                            let Some(y) = optional_pointer::<f64>(&v, "/Y") else {
                                continue;
                            };
                            let Some(z) = optional_pointer::<f64>(&v, "/Z") else {
                                continue;
                            };

                            let car_position = db::tables::DriverPosition {
                                driver_nr,
                                timestamp: timestamp.clone(),
                                status,
                                x,
                                y,
                                z,
                            };

                            vec.push(car_position);
                        }
                    }
                }
            }
        }
    }

    vec
}
