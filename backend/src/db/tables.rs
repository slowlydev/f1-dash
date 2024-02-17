pub struct SessionStatus {
    pub utc: Option<String>,
    pub track_status: Option<String>,
    pub session_status: Option<String>,
}

pub struct LapCount {
    pub current: Option<String>,
    pub total: Option<String>,
}

pub struct Weather {
    pub humidity: Option<String>,
    pub pressure: Option<String>,
    pub rainfall: Option<String>,
    pub wind_direction: Option<String>,
    pub wind_speed: Option<String>,
    pub air_temp: Option<String>,
    pub track_temp: Option<String>,
}

pub struct RaceControlMessages {
    pub utc: Option<String>,
    pub lap: Option<String>,
    pub message: Option<String>,
    pub category: Option<String>,
    pub flag: Option<String>,
    pub scope: Option<String>,
    pub sector: Option<String>,
    pub drs_enabled: Option<String>,
}

pub struct TeamRadio {
    pub utc: Option<String>,
    pub driver_nr: Option<String>,
    pub url: Option<String>,
}

pub struct GeneralTiming {
    pub no_entries: Option<Vec<String>>,
    pub session_part: Option<i16>,
    pub cut_off_time: Option<String>,
    pub cut_off_percentage: Option<String>,
}

pub struct Driver {
    pub driver_nr: String,
    pub full_name: String,
    pub first_name: String,
    pub last_name: String,
    pub short: String,
    pub country: String,
    pub line: String,
    pub team_name: String,
    pub team_color: String,
}

pub struct DriverTiming {
    pub driver_nr: Option<String>,
    pub line: Option<String>,
    pub position: Option<String>,
    pub show_position: Option<bool>,
    pub gap_to_leader: Option<String>,
    pub gap_to_ahead: Option<String>,
    pub catching_ahead: Option<bool>,
    pub lap_time: Option<String>,
    pub lap_time_fastest: Option<bool>,
    pub lap_time_pb: Option<bool>,
    // TODO leaving this for now because fastest was not in TimingData
    // best_lap_time: String,
    // best_lap_time_fastest: bool,
    // best_lap_time_pb: bool,
    pub number_of_laps: Option<i64>,
    pub number_of_pit_stops: Option<i64>,
    pub status: Option<i64>,
    pub retired: Option<bool>,
    pub in_pit: Option<bool>,
    pub pit_out: Option<bool>,
    pub knocked_out: Option<bool>,
    pub stopped: Option<bool>,
}

pub struct DriverSector {
    pub driver_nr: Option<String>,
    pub number: Option<i64>,
    pub time: Option<String>,
    pub previous_time: Option<String>,
    pub status: Option<i64>,
    pub stopped: Option<bool>,
    pub overall_fastest: Option<bool>,
    pub personal_fastest: Option<bool>,
}

pub struct DriverSectorSegment {
    pub driver_nr: Option<String>,
    pub sector_number: Option<i64>,
    pub number: Option<i64>,
    pub status: Option<i64>,
}

pub struct DriverSpeeds {
    pub driver_nr: Option<String>,
    pub station: Option<String>,
    pub value: Option<String>,
    pub status: Option<i64>,
    pub overall_fastest: Option<bool>,
    pub personal_fastest: Option<bool>,
}

pub struct DriverStats {
    pub driver_nr: Option<String>,
    pub pb_lap_time: Option<String>,
    pub pb_lap_time_pos: Option<i64>,
}

pub struct DriverSectorStats {
    pub driver_nr: Option<String>,
    pub number: Option<i64>,
    pub value: Option<String>,
    pub position: Option<i64>,
}

pub struct DriverPosition {
    pub driver_nr: String,
    pub timestamp: String,
    pub status: String,
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

pub struct DriverCarData {
    pub driver_nr: String,
    pub timestamp: String,
    pub rpm: f64,
    pub speed: f64,
    pub gear: i64,
    pub throttle: i64,
    pub breaks: bool,
    pub drs: bool,
}
