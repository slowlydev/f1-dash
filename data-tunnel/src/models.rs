use serde::{Deserialize, Serialize};

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct State {
    pub extrapolatedClock: Option<ExtrapolatedClock>,
    pub sessionData: Option<SessionData>,
    pub trackStatus: Option<TrackStatus>,
    pub lapCount: Option<LapCount>,
    pub weather: Option<Weather>,

    pub raceControlMessages: Option<Vec<RaceControlMessage>>,
    pub drivers: Option<Vec<Driver>>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct ExtrapolatedClock {
    pub utc: String,
    pub remaining: String,
    pub extrapolating: bool,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct LapCount {
    pub current: i32,
    pub total: i32,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct RaceControlMessage {
    pub utc: String,
    pub lap: i64,
    pub message: String,
    pub category: String,

    pub flag: Option<String>,
    pub scope: Option<String>,
    pub sector: Option<i16>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct SessionData {
    // pub series: Vec<String> we ignore for now
    pub status: Vec<StatusUpdate>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct StatusUpdate {
    pub utc: String,
    pub trackStatus: Option<String>,
    pub sessionStatus: Option<String>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct SessionInfo {
    pub name: String,
    pub officialName: String,
    pub location: String,

    pub countryName: String,
    pub countryCode: String,

    pub circuitName: String,
    pub circuitKey: i64,

    pub startDate: String,
    pub endDate: String,
    pub offset: String,

    pub r#type: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Weather {
    pub humidity: f64,
    pub pressure: f64,
    pub rainfall: i16,
    pub wind_direction: i16,
    pub wind_speed: f64,
    pub air_temp: f64,
    pub track_temp: f64,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct TrackStatus {
    pub status: i8,
    pub statusMessage: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Driver {
    pub nr: String,

    pub broadcastName: String,
    pub fullName: String,
    pub firstName: String,
    pub lastName: String,
    pub short: String,
    pub country: String,

    pub line: i8,
    pub position: String,

    pub teamName: String,
    pub teamColor: String,

    pub status: i64,

    pub gapToLeader: String,
    pub gapToFront: String,
    pub catchingFront: bool,

    pub sectors: Vec<Sector>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct TimeStats {
    pub value: String,
    pub fastest: bool,
    pub pb: bool,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Sector {
    pub current: TimeStats,
    pub fastest: TimeStats,
    pub segments: Vec<i64>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Stint {
    pub compound: String,
    pub laps: String,
    pub new: bool,
}

pub fn initial_state() -> State {
    State {
        extrapolatedClock: None,
        sessionData: None,
        trackStatus: None,
        lapCount: None,
        weather: None,
        raceControlMessages: None,
        drivers: None,
    }
}
