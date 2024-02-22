use serde::Serialize;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct SessionInfo {
    // SessionInfo
    pub key: Option<i64>,
    pub kind: Option<String>, // in the f1 api its type
    pub name: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub gmt_offset: Option<String>,
    pub path: Option<String>,
    pub number: Option<i64>,

    // TrackStatus
    pub track_status: Option<String>,
    pub track_message: Option<String>,
}

impl SessionInfo {
    pub fn is_empty(&self) -> bool {
        self.key.is_none()
            && self.kind.is_none()
            && self.name.is_none()
            && self.start_date.is_none()
            && self.end_date.is_none()
            && self.gmt_offset.is_none()
            && self.path.is_none()
            && self.number.is_none()
            && self.track_status.is_none()
            && self.track_message.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct Meeting {
    // SessionInfo -> Meeting
    pub key: Option<String>,
    pub name: Option<String>,
    pub official_name: Option<String>,
    pub location: Option<String>,
    pub country_key: Option<String>,
    pub country_code: Option<String>,
    pub country_name: Option<String>,
    pub circuit_key: Option<i64>,
    pub circuit_name: Option<String>,
}

impl Meeting {
    pub fn is_empty(&self) -> bool {
        self.key.is_none()
            && self.name.is_none()
            && self.official_name.is_none()
            && self.location.is_none()
            && self.country_key.is_none()
            && self.country_code.is_none()
            && self.country_name.is_none()
            && self.circuit_key.is_none()
            && self.circuit_name.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct LapCount {
    pub current: Option<i64>,
    pub total: Option<i64>,
}

impl LapCount {
    pub fn is_empty(&self) -> bool {
        self.current.is_none() && self.total.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct Weather {
    pub humidity: Option<f64>,
    pub pressure: Option<f64>,
    pub rainfall: Option<bool>,
    pub wind_direction: Option<i64>,
    pub wind_speed: Option<f64>,
    pub air_temp: Option<f64>,
    pub track_temp: Option<f64>,
}

impl Weather {
    pub fn is_empty(&self) -> bool {
        self.humidity.is_none()
            && self.pressure.is_none()
            && self.rainfall.is_none()
            && self.wind_direction.is_none()
            && self.wind_speed.is_none()
            && self.air_temp.is_none()
            && self.track_temp.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct RaceControlMessages {
    pub utc: Option<String>,
    pub lap: Option<i64>,
    pub message: Option<String>,
    pub category: Option<String>,
    pub flag: Option<String>,
    pub scope: Option<String>,
    pub sector: Option<String>,
    pub drs_enabled: Option<String>,
}

impl RaceControlMessages {
    pub fn is_empty(&self) -> bool {
        self.utc.is_none() && self.message.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct TeamRadio {
    pub utc: Option<String>,
    pub driver_nr: Option<String>,
    pub url: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct GeneralTiming {
    pub no_entries: Option<Vec<i64>>,
    pub session_part: Option<i16>,
    pub cut_off_time: Option<String>,
    pub cut_off_percentage: Option<String>,
}

impl GeneralTiming {
    pub fn is_empty(&self) -> bool {
        self.no_entries.is_none()
            && self.session_part.is_none()
            && self.cut_off_time.is_none()
            && self.cut_off_percentage.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct Driver {
    pub driver_nr: String,
    pub full_name: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub short: Option<String>,
    pub country: Option<String>,
    pub line: Option<i64>,
    pub team_name: Option<String>,
    pub team_color: Option<String>,
    pub picture: Option<String>,
}

impl Driver {
    pub fn is_empty(&self) -> bool {
        self.full_name.is_none()
            && self.first_name.is_none()
            && self.last_name.is_none()
            && self.short.is_none()
            && self.country.is_none()
            && self.line.is_none()
            && self.team_name.is_none()
            && self.team_color.is_none()
            && self.picture.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverTiming {
    pub driver_nr: String,
    pub line: Option<String>,
    pub position: Option<String>,
    pub show_position: Option<bool>,
    pub gap_to_leader: Option<i64>,      // 0 when gap is 1LAP
    pub gap_to_ahead: Option<i64>,       // 0 when gap is 1LAP
    pub gap_to_leader_laps: Option<i64>, // when gap is 1LAP, this gets set
    pub gap_to_ahead_laps: Option<i64>,  // when gap is 1LAP, this gets set
    pub catching_ahead: Option<bool>,
    pub lap_time: Option<i64>,
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

impl DriverTiming {
    pub fn is_empty(&self) -> bool {
        self.line.is_none()
            && self.position.is_none()
            && self.show_position.is_none()
            && self.gap_to_leader.is_none()
            && self.gap_to_ahead.is_none()
            && self.catching_ahead.is_none()
            && self.lap_time.is_none()
            && self.lap_time_fastest.is_none()
            && self.lap_time_pb.is_none()
            && self.number_of_laps.is_none()
            && self.number_of_pit_stops.is_none()
            && self.status.is_none()
            && self.retired.is_none()
            && self.in_pit.is_none()
            && self.pit_out.is_none()
            && self.knocked_out.is_none()
            && self.stopped.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverSector {
    pub driver_nr: String,
    pub number: i64,
    pub time: Option<i64>,
    pub previous_time: Option<i64>,
    pub status: Option<i64>,
    pub stopped: Option<bool>,
    pub overall_fastest: Option<bool>,
    pub personal_fastest: Option<bool>,
}

impl DriverSector {
    pub fn is_empty(&self) -> bool {
        self.time.is_none()
            && self.previous_time.is_none()
            && self.status.is_none()
            && self.stopped.is_none()
            && self.overall_fastest.is_none()
            && self.personal_fastest.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverSectorSegment {
    pub driver_nr: String,
    pub sector_number: i64,
    pub number: i64,
    pub status: Option<i64>,
}

impl DriverSectorSegment {
    pub fn is_empty(&self) -> bool {
        self.status.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverStint {
    pub driver_nr: String,
    pub stint_nr: i64,
    pub lap_flags: Option<i64>,
    pub compound: Option<String>,
    pub new: Option<bool>,
    pub tires_not_changed: Option<bool>, // its 0 or 1
    pub total_laps: Option<i64>,
    pub start_laps: Option<i64>,
    pub lap_time: Option<i64>,
    pub lap_number: Option<i64>,
}

impl DriverStint {
    pub fn is_empty(&self) -> bool {
        self.lap_flags.is_none()
            && self.compound.is_none()
            && self.new.is_none()
            && self.tires_not_changed.is_none()
            && self.total_laps.is_none()
            && self.start_laps.is_none()
            && self.lap_time.is_none()
            && self.lap_number.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverSpeeds {
    pub driver_nr: String,
    pub station: String,
    pub value: Option<i64>,
    pub status: Option<i64>,
    pub overall_fastest: Option<bool>,
    pub personal_fastest: Option<bool>,
}

impl DriverSpeeds {
    pub fn is_empty(&self) -> bool {
        self.value.is_none()
            && self.status.is_none()
            && self.overall_fastest.is_none()
            && self.personal_fastest.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverStats {
    pub driver_nr: String,
    pub lap: Option<i64>,
    pub pb_lap_time: Option<i64>,
    pub pb_lap_time_pos: Option<i64>,
}

impl DriverStats {
    pub fn is_empty(&self) -> bool {
        self.lap.is_none() && self.pb_lap_time.is_none() && self.pb_lap_time_pos.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverSectorStats {
    pub driver_nr: String,
    pub number: i64,
    pub value: Option<i64>,
    pub position: Option<i64>,
}

impl DriverSectorStats {
    pub fn is_empty(&self) -> bool {
        self.value.is_none() && self.position.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverPosition {
    pub driver_nr: String,
    pub timestamp: String,
    pub status: Option<String>,
    pub x: Option<f64>,
    pub y: Option<f64>,
    pub z: Option<f64>,
}

impl DriverPosition {
    pub fn is_empty(&self) -> bool {
        self.status.is_none() && self.x.is_none() && self.y.is_none() && self.z.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct DriverCarData {
    pub driver_nr: String,
    pub timestamp: String,
    pub rpm: Option<f64>,
    pub speed: Option<f64>,
    pub gear: Option<i64>,
    pub throttle: Option<i64>,
    pub breaks: Option<bool>,
    pub drs: Option<bool>,
}

impl DriverCarData {
    pub fn is_empty(&self) -> bool {
        self.rpm.is_none()
            && self.speed.is_none()
            && self.gear.is_none()
            && self.throttle.is_none()
            && self.breaks.is_none()
            && self.drs.is_none()
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct ExtrapolatedClock {
    pub extrapolating: Option<bool>,
    pub remaining: Option<String>,
    pub utc: Option<String>,
}

impl ExtrapolatedClock {
    pub fn is_empty(&self) -> bool {
        self.extrapolating.is_none() && self.remaining.is_none() && self.utc.is_none()
    }
}
