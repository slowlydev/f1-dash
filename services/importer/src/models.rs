use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct State {
    // pub heartbeat: Option<Heartbeat>,
    // pub extrapolated_clock: Option<ExtrapolatedClock>,
    // pub top_three: Option<TopThree>,
    // pub timing_stats: Option<TimingStats>,
    pub timing_app_data: Option<TimingAppData>,
    // pub weather_data: Option<WeatherData>,
    // pub track_status: Option<TrackStatus>,
    // pub session_status: Option<SessionStatus>,
    // pub driver_list: Option<HashMap<String, Driver>>,
    // pub race_control_messages: Option<RaceControlMessages>,
    // pub session_info: Option<SessionInfo>,
    // pub session_data: Option<SessionData>,
    pub lap_count: Option<LapCount>,
    pub timing_data: Option<TimingData>,
    // pub team_radio: Option<TeamRadio>,
    // pub championship_prediction: Option<ChampionshipPrediction>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimingStats {
    pub withheld: bool,
    pub lines: HashMap<String, TimingStatsDriver>,
    pub session_type: String,
    #[serde(rename = "_kf")]
    pub kf: bool,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimingAppData {
    pub lines: HashMap<String, TimingAppDataDriver>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimingAppDataDriver {
    pub racing_number: String,
    pub stints: Vec<Stint>,
    pub line: i32,
    pub grid_pos: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Stint {
    pub total_laps: Option<i32>,
    pub compound: Option<String>, // "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET"
    #[serde(rename = "new")]
    pub is_new: Option<String>, // "TRUE" | "FALSE"
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherData {
    pub air_temp: String,
    pub humidity: String,
    pub pressure: String,
    pub rainfall: String,
    pub track_temp: String,
    pub wind_direction: String,
    pub wind_speed: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrackStatus {
    pub status: String,
    pub message: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionStatus {
    pub status: String, // "Started" | "Finished" | "Finalised" | "Ends"
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Driver {
    pub racing_number: String,
    pub broadcast_name: String,
    pub full_name: String,
    pub tla: String,
    pub line: i32,
    pub team_name: String,
    pub team_colour: String,
    pub first_name: String,
    pub last_name: String,
    pub reference: String,
    pub headshot_url: String,
    pub country_code: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LapCount {
    pub current_lap: i32,
    pub total_laps: i32,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimingData {
    pub no_entries: Option<Vec<i32>>,
    pub session_part: Option<i32>,
    pub cut_off_time: Option<String>,
    pub cut_off_percentage: Option<String>,
    pub lines: HashMap<String, TimingDataDriver>,
    pub withheld: bool,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimingDataDriver {
    pub stats: Option<Vec<Stats>>,
    pub time_diff_to_fastest: Option<String>,
    pub time_diff_to_position_ahead: Option<String>,
    pub gap_to_leader: String,
    pub interval_to_position_ahead: Option<IntervalToPositionAhead>,
    pub line: i32,
    // pub position: String,
    // pub show_position: bool,
    pub racing_number: String,
    // pub retired: bool,
    // pub in_pit: bool,
    // pub pit_out: bool,
    // pub stopped: bool,
    // pub status: i32,
    pub sectors: Vec<Sector>,
    // pub speeds: Speeds,
    pub best_lap_time: PersonalBestLapTime,
    pub last_lap_time: I1,
    // pub number_of_laps: i32,
    // pub knocked_out: Option<bool>,
    // pub cutoff: Option<bool>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Stats {
    pub time_diff_to_fastest: String,
    pub time_diff_to_position_ahead: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IntervalToPositionAhead {
    pub value: String,
    pub catching: bool,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Sector {
    pub stopped: bool,
    pub value: String,
    pub previous_value: Option<String>,
    pub status: i32,
    pub overall_fastest: bool,
    pub personal_fastest: bool,
    pub segments: Vec<Segment>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Segment {
    pub status: i32,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Speeds {
    pub i1: I1,
    pub i2: I1,
    pub fl: I1,
    pub st: I1,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct I1 {
    pub value: String,
    pub status: i32,
    pub overall_fastest: bool,
    pub personal_fastest: bool,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimingStatsDriver {
    pub line: i32,
    pub racing_number: String,
    pub personal_best_lap_time: PersonalBestLapTime,
    pub best_sectors: Vec<PersonalBestLapTime>,
    pub best_speeds: BestSpeeds,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BestSpeeds {
    pub i1: PersonalBestLapTime,
    pub i2: PersonalBestLapTime,
    pub fl: PersonalBestLapTime,
    pub st: PersonalBestLapTime,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalBestLapTime {
    pub value: String,
    // pub position: i32,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TopThreeDriver {
    pub position: String,
    pub show_position: bool,
    pub racing_number: String,
    pub tla: String,
    pub broadcast_name: String,
    pub full_name: String,
    pub team: String,
    pub team_colour: String,
    pub lap_time: String,
    pub lap_state: i32,
    pub diff_to_ahead: String,
    pub diff_to_leader: String,
    pub overall_fastest: bool,
    pub personal_fastest: bool,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TeamRadio {
    pub captures: Vec<RadioCapture>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RadioCapture {
    pub utc: String,
    pub racing_number: String,
    pub path: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChampionshipPrediction {
    pub drivers: HashMap<String, ChampionshipDriver>,
    pub teams: HashMap<String, ChampionshipTeam>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChampionshipDriver {
    pub racing_number: String,
    pub current_position: i32,
    pub predicted_position: i32,
    pub current_points: i32,
    pub predicted_points: i32,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChampionshipTeam {
    pub team_name: String,
    pub current_position: i32,
    pub predicted_position: i32,
    pub current_points: i32,
    pub predicted_points: i32,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Position {
    pub position: Vec<PositionItem>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PositionItem {
    pub timestamp: String,
    pub entries: HashMap<String, PositionCar>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PositionCar {
    pub status: String,
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarData {
    pub entries: Vec<Entry>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    pub utc: String,
    pub cars: HashMap<String, CarDataChannels>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarDataChannels {
    #[serde(rename = "0")]
    pub rpm: i32,
    #[serde(rename = "2")]
    pub speed: i32,
    #[serde(rename = "3")]
    pub gear: i32,
    #[serde(rename = "4")]
    pub throttle: i32,
    #[serde(rename = "5")]
    pub brake: i32,
    #[serde(rename = "45")]
    pub drs: i32,
}
