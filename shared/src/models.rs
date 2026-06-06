use std::collections::HashMap;

pub struct State {
    pub drivers: HashMap<u8, Driver>,
    pub timings: HashMap<u8, Timing>,
    pub sectors: HashMap<u8, [Sector; 3]>,

    pub car_positions: HashMap<u8, CarPosition>,
    pub car_telemetry: HashMap<u8, CarTelemetry>,

    pub radio_messages: Vec<RadioMessage>,
    pub race_control_messages: Vec<RaceControlMessage>,
}

pub enum SessionType {
    Practice,
    SprintQualifying,
    SprintRace,
    Qualifying,
    Race,
}

pub struct Session {
    pub session_type: SessionType,
    pub session_name: String,
    pub session_nr: u8,

    pub start: u64,
    pub end: u64,
}

pub struct TimingDriver {}

pub struct Driver {
    pub nr: u8,

    pub name: String,
    pub family_name: String,
    pub short_name: String,

    pub team: String,
    pub team_color: String,
}

pub struct Timing {
    pub position: Option<u8>,

    pub interval: Option<i64>,
    pub leader_gap: Option<i64>,

    pub laps: Option<u8>,
    pub laptime: Option<i64>,
    pub last_laptime: Option<i64>,
    pub best_laptime: Option<i64>,
}

pub enum TimeStatus {
    PersonalBest,
    BestOverall,
    None,
}

pub enum MiniSector {
    PersonalBest,
    BestOverall,
    Pit,
    None,
}

pub struct Sector {
    pub nr: u8,
    pub time: u32,
    pub time_status: TimeStatus,

    pub mini_sectors: HashMap<u8, MiniSector>,
}

pub struct CarPosition {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

pub struct CarTelemetry {
    pub throttle: f32,
    pub brake: f32,
    pub gear: u8,
    pub rpm: u16,
    pub speed: u16,
}

pub struct RadioMessage {
    pub nr: u8,
    pub path: String,
    pub utc: u64,
}

pub enum Flag {
    Green,
    Yellow,
    Red,
    Blue,
    Checkered,
}

pub struct RaceControlMessage {
    pub nr: u8,
    pub message: String,
    pub flag: Flag,
    pub utc: u64,
}
