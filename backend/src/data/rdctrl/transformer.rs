use std::collections::HashMap;

use serde::Serialize;
use serde_json::Value;

use crate::{client, db};

pub mod inflate;
pub mod parser;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct State {
    pub weather: Option<db::tables::Weather>,
    pub extrapolated_clock: Option<db::tables::ExtrapolatedClock>,
    pub lap_count: Option<db::tables::LapCount>,
    pub session_info: Option<db::tables::SessionInfo>,
    pub meeting: Option<db::tables::Meeting>,
    pub track_status: Option<db::tables::TrackStatus>,
    pub general_timing: Option<db::tables::GeneralTiming>,

    pub team_radios: Vec<db::tables::TeamRadio>,
    pub race_control_messages: Vec<db::tables::RaceControlMessages>,

    pub driver_timings: Vec<db::tables::DriverTiming>,
    pub driver_sectors: Vec<db::tables::DriverSector>,
    pub driver_speeds: Vec<db::tables::DriverSpeeds>,
    pub driver_sector_segments: Vec<db::tables::DriverSectorSegment>,
    pub driver_stints: Vec<db::tables::DriverStint>,

    pub drivers: Vec<db::tables::Driver>,

    pub driver_stats: Vec<db::tables::DriverStats>,
    pub driver_sector_stats: Vec<db::tables::DriverSectorStats>,

    pub car_data: Vec<db::tables::DriverCarData>,
    pub positions: Vec<db::tables::DriverPosition>,
}

impl State {
    pub fn new() -> Self {
        State {
            weather: None,
            extrapolated_clock: None,
            lap_count: None,
            team_radios: Vec::new(),
            race_control_messages: Vec::new(),
            general_timing: None,
            driver_timings: Vec::new(),
            driver_sectors: Vec::new(),
            driver_speeds: Vec::new(),
            driver_sector_segments: Vec::new(),
            driver_stints: Vec::new(),
            drivers: Vec::new(),
            driver_stats: Vec::new(),
            driver_sector_stats: Vec::new(),
            car_data: Vec::new(),
            positions: Vec::new(),
            session_info: None,
            meeting: None,
            track_status: None,
        }
    }
}

pub fn parse_updates(updates: HashMap<String, client::parser::Update>) -> State {
    let mut parsed = State::new();

    for (category, update) in updates {
        parse_generic(category, update.state, &mut parsed);
    }

    parsed
}

pub fn parse_initial(initial: HashMap<String, Value>) -> State {
    let mut parsed = State::new();

    for (category, value) in initial {
        parse_generic(category, value, &mut parsed);
    }

    parsed
}

fn parse_generic(category: String, v: Value, updates: &mut State) {
    match category.as_str() {
        "WeatherData" => {
            let weather = parser::parse_weather(v);
            updates.weather = weather;
        }
        "ExtrapolatedClock" => {
            let clock = parser::parse_extrapolated_clock(v);
            updates.extrapolated_clock = clock;
        }
        "LapCount" => {
            let lap_count = parser::parse_lap_count(v);
            updates.lap_count = lap_count;
        }
        "TeamRadio" => {
            let mut team_radio = parser::parse_team_radio(v);
            updates.team_radios.append(&mut team_radio);
        }
        "RaceControlMessages" => {
            let mut rcm: Vec<_> = parser::parse_race_control_messages(v);
            updates.race_control_messages.append(&mut rcm);
        }
        "TimingData" => {
            let general_timing = parser::parse_general_timing(v.clone());
            updates.general_timing = general_timing;

            let mut driver_timings = parser::parse_driver_timing(v.clone());
            updates.driver_timings.append(&mut driver_timings);

            let mut driver_sectors = parser::parse_driver_sector(v.clone());
            updates.driver_sectors.append(&mut driver_sectors);

            let mut driver_speeds = parser::parse_driver_speed(v.clone());
            updates.driver_speeds.append(&mut driver_speeds);

            let mut dss = parser::parse_driver_sector_segment(v.clone());
            updates.driver_sector_segments.append(&mut dss);
        }
        "TimingAppData" => {
            let mut driver_stints = parser::parse_driver_stint(v);
            updates.driver_stints.append(&mut driver_stints);
        }
        "DriverList" => {
            let mut drivers = parser::parse_driver(v);
            updates.drivers.append(&mut drivers);
        }
        "TimingStats" => {
            let mut driver_stats = parser::parse_driver_stats(v.clone());
            updates.driver_stats.append(&mut driver_stats);

            let mut driver_sector_stats = parser::parse_driver_sector_stats(v);
            updates.driver_sector_stats.append(&mut driver_sector_stats);
        }
        "CarData.z" => {
            let mut car_data = parser::parse_car_data(v);
            updates.car_data.append(&mut car_data);
        }
        "Position.z" => {
            let mut position = parser::parse_position(v);
            updates.positions.append(&mut position);
        }
        "SessionInfo" => {
            let session_info = parser::parse_session_info(v.clone());
            updates.session_info = session_info;

            let meeting = parser::parse_meeting(v);
            updates.meeting = meeting;
        }
        "TrackStatus" => {
            let session_info = parser::parse_track_status(v);
            updates.track_status = session_info;
        }
        _ => {}
    }
}
