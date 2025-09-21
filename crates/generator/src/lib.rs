use std::{
    io::{self, Write},
    sync::mpsc,
    thread,
};

use chrono::{DateTime, SecondsFormat};
use data::merge::merge;
use inquire::{CustomType, Select, error::InquireResult};
use reqwest::blocking::Client;
use serde::Deserialize;
use serde_json::{Map, Value, json};

const REQUIRED_FEEDS: [&'static str; 20] = [
    "Heartbeat",
    "CarData.z",
    "Position.z",
    "ExtrapolatedClock",
    "TopThree",
    "RcmSeries",
    "TimingStats",
    "TimingAppData",
    "WeatherData",
    "TrackStatus",
    "SessionStatus",
    "DriverList",
    "RaceControlMessages",
    "SessionInfo",
    "SessionData",
    "LapCount",
    "TimingData",
    "TeamRadio",
    "PitLaneTimeCollection",
    "ChampionshipPrediction",
];

#[derive(Deserialize, Clone)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct Session {
    pub key: u16,
    pub r#type: String,
    #[serde(default)]
    pub number: i8,
    pub name: String,
    pub start_date: String,
    pub end_date: String,
    pub gmt_offset: String,
    pub path: String,
}

impl std::fmt::Display for Session {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name)
    }
}

#[derive(Deserialize, Clone)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct Country {
    pub key: u16,
    pub code: String,
    pub name: String,
}

#[derive(Deserialize, Clone)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct Circuit {
    pub key: u16,
    pub short_name: String,
}

#[derive(Deserialize, Clone)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct Meeting {
    pub sessions: Vec<Session>,
    pub key: u16,
    pub code: String,
    pub number: u8,
    pub location: String,
    pub official_name: String,
    pub name: String,
    pub country: Country,
    pub circuit: Circuit,
}

impl std::fmt::Display for Meeting {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name)
    }
}

#[derive(Deserialize)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct YearIndex {
    pub year: u16,
    pub meetings: Vec<Meeting>,
}

#[derive(Deserialize)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct RaceFeeds {
    pub feeds: Map<String, Value>,
}

#[derive(Deserialize)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct Heartbeat {
    pub utc: String,
}

#[derive(Clone)]
pub struct Message {
    pub name: String,
    pub data: Value,
    pub time: u64,
}

#[derive(Clone)]
pub struct RawReplay {
    pub messages: Vec<Message>,
    pub base_time: Option<u64>,
    pub start_time: Option<u64>,
}

#[derive(Debug)]
pub enum JsonRequestError {
    ReqwestErr(reqwest::Error),
    JsonErr(serde_json::Error),
}

impl From<reqwest::Error> for JsonRequestError {
    fn from(value: reqwest::Error) -> Self {
        Self::ReqwestErr(value)
    }
}

impl From<serde_json::Error> for JsonRequestError {
    fn from(value: serde_json::Error) -> Self {
        Self::JsonErr(value)
    }
}

impl std::fmt::Display for JsonRequestError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            JsonRequestError::ReqwestErr(e) => write!(f, "{e}"),
            JsonRequestError::JsonErr(e) => write!(f, "{e}"),
        }
    }
}

pub fn get_meetings(year: u16) -> Result<YearIndex, JsonRequestError> {
    let res = reqwest::blocking::get(format!(
        "https://livetiming.formula1.com/static/{year}/Index.json"
    ))?
    .text()?;
    Ok(serde_json::from_str(res.trim_start_matches("\u{feff}"))?)
}

pub fn get_race_feeds(session: &Session) -> Result<Vec<String>, JsonRequestError> {
    let res = reqwest::blocking::get(format!(
        "https://livetiming.formula1.com/static/{}Index.json",
        session.path
    ))?
    .text()?;
    Ok(
        serde_json::from_str::<RaceFeeds>(res.trim_start_matches("\u{feff}"))?
            .feeds
            .keys()
            .map(|feed| feed.clone())
            .collect(),
    )
}

fn get_feed_data(client: &Client, path: &String, name: &String) -> reqwest::Result<String> {
    client
        .get(format!(
            "https://livetiming.formula1.com/static/{path}{name}.jsonStream"
        ))
        .send()?
        .text()
}

pub fn select_year() -> InquireResult<u16> {
    CustomType::<u16>::new("Choose a year")
        .with_error_message("Invalid year")
        .prompt()
}

pub fn select_meeting(meetings: &Vec<Meeting>) -> InquireResult<Meeting> {
    let mut options = meetings.clone();
    options.reverse();
    Select::new("Choose a meeting", options)
        .with_page_size(meetings.len())
        .prompt()
}

pub fn select_session(sessions: &Vec<Session>) -> InquireResult<Session> {
    let mut options = sessions.clone();
    options.reverse();
    Select::new("Choose a session", options)
        .with_page_size(sessions.len())
        .prompt()
}

pub fn select_year_index() -> YearIndex {
    loop {
        let year = select_year().expect("Failed to read input");
        match get_meetings(year) {
            Ok(year_index) => {
                if !year_index.meetings.is_empty() {
                    return year_index;
                }
                eprintln!("No races available for {year}")
            }
            Err(error) => match error {
                JsonRequestError::ReqwestErr(error) => eprintln!("{error}"),
                JsonRequestError::JsonErr(_) => eprintln!("No races available for {year}"),
            },
        }
    }
}

fn parse_line(line: &str) -> (u64, Value) {
    let line = line.trim_start_matches("\u{feff}");
    let time = time_to_ms(&line[0..12]);
    let data: Value = line[12..].parse().expect("Invalid data");

    (time, data)
}

fn time_to_ms(time: &str) -> u64 {
    const MS_IN_HOUR: u64 = 1000 * 60 * 60;
    const MS_IN_MINUTE: u64 = 1000 * 60;
    const MS_IN_SECOND: u64 = 1000;

    let [hours, mins, secs_and_ms] = time.split(":").collect::<Vec<_>>()[0..3] else {
        panic!("Invalid time format")
    };
    let [secs, ms] = secs_and_ms.split(".").collect::<Vec<_>>()[0..2] else {
        panic!("Invalid time format")
    };
    let hours: u64 = hours.parse().expect("Invalid hours");
    let mins: u64 = mins.parse().expect("Invalid minutes");
    let secs: u64 = secs.parse().expect("Invalid seconds");
    let ms: u64 = ms.parse().expect("Invalid milliseconds");

    hours * MS_IN_HOUR + mins * MS_IN_MINUTE + secs * MS_IN_SECOND + ms
}

fn calculate_base_time(time: u64, heartbeat_data: &Value) -> Option<u64> {
    let heartbeat = serde_json::from_value::<Heartbeat>(heartbeat_data.clone()).ok()?;
    let date = DateTime::parse_from_rfc3339(&heartbeat.utc).ok()?;
    let timestamp = date.timestamp_millis();
    if timestamp < 0 {
        return None;
    };
    Some(timestamp as u64 - time)
}

fn calculate_start_time(session: &Session) -> Option<u64> {
    let offset_str = session.gmt_offset.split(":").collect::<Vec<_>>()[0..2].join(":");
    let offset_str = if session.gmt_offset.starts_with("-") {
        offset_str
    } else {
        format!("+{offset_str}")
    };
    match DateTime::parse_from_rfc3339(&format!("{}{}", session.start_date, offset_str)) {
        Ok(date) => {
            let timestamp = date.timestamp_millis();
            if timestamp < 0 {
                None
            } else {
                Some(timestamp as u64)
            }
        }
        Err(_) => None,
    }
}

fn create_inital_message(messages: Vec<&Message>) -> String {
    let mut data = Map::new();
    for message in messages {
        if data.contains_key(&message.name) {
            merge(data.get_mut(&message.name).unwrap(), message.data.clone());
        } else {
            data.insert(message.name.clone(), message.data.clone());
        }
    }
    json!({
        "I": 1,
        "R": data
    })
    .to_string()
}

fn merge_messages(messages: Vec<&Message>, base_time: u64) -> String {
    let m: Vec<Value> = messages
        .iter()
        .map(|message| {
            json!({
                "H": "Streaming",
                "M": "feed",
                "A": [
                    message.name,
                    message.data,
                    DateTime::from_timestamp_millis((base_time + message.time) as i64)
                        .expect("Something went wrong with the dates")
                        .to_rfc3339_opts(SecondsFormat::Millis, true)
                ]
            })
        })
        .collect();
    json!({
        "M": m
    })
    .to_string()
}

enum ThreadMessage {
    Message(Message),
    BaseTime(u64),
    Error(String, reqwest::Error),
    Finished,
}

pub fn generate_raw_replay(session: &Session, show_progress_bar: bool) -> RawReplay {
    let feeds = get_race_feeds(&session).unwrap_or(REQUIRED_FEEDS.map(String::from).to_vec());

    let client = reqwest::blocking::Client::new();

    let (tx, rx) = mpsc::channel();
    let mut total_threads = 0;

    for feed in feeds {
        if !REQUIRED_FEEDS.contains(&feed.as_str()) {
            continue;
        }

        let tx = tx.clone();
        let client = client.clone();
        let feed = feed.clone();
        let path = session.path.clone();

        thread::spawn(move || {
            let data = get_feed_data(&client, &path, &feed).unwrap_or_else(|err| {
                tx.send(ThreadMessage::Error(feed.clone(), err)).unwrap();
                String::new()
            });

            let lines = data.lines();
            let mut send_base_time = feed == "Heartbeat";

            for line in lines {
                let (time, data) = parse_line(line);

                if send_base_time {
                    if let Some(base_time) = calculate_base_time(time, &data) {
                        tx.send(ThreadMessage::BaseTime(base_time)).unwrap();
                        send_base_time = false;
                    }
                }

                let message = Message {
                    name: String::from(&feed),
                    data,
                    time,
                };
                tx.send(ThreadMessage::Message(message)).unwrap();
            }

            tx.send(ThreadMessage::Finished).unwrap();
        });
        total_threads += 1;
    }

    let mut messages: Vec<Message> = Vec::new();
    let mut base_time: Option<u64> = None;
    let mut threads_finished = 0;

    for message in rx {
        match message {
            ThreadMessage::Message(message) => {
                let i = messages.partition_point(|m| m.time <= message.time);
                messages.insert(i, message);
            }
            ThreadMessage::BaseTime(bt) => {
                if base_time == None {
                    base_time = Some(bt)
                }
            }
            ThreadMessage::Error(feed, err) => {
                eprintln!("\rSomething went wrong with \"{feed}\": {err}")
            }
            ThreadMessage::Finished => {
                threads_finished += 1;
                if show_progress_bar {
                    print!(
                        "\r[{:num$}]",
                        "#".repeat(threads_finished),
                        num = total_threads
                    );
                    let _ = io::stdout().flush();
                }
            }
        }
        if threads_finished == total_threads {
            break;
        }
    }

    if show_progress_bar {
        print!("\r{:size$}\r", "", size = total_threads + 2)
    }

    RawReplay {
        messages,
        base_time,
        start_time: calculate_start_time(&session),
    }
}

pub fn generate_replay(session: &Session, show_progress_bar: bool) -> String {
    const FIVE_MINS_IN_TENTHS: u64 = 10 * 60 * 5;

    let raw_replay = generate_raw_replay(session, show_progress_bar);

    let base_time = raw_replay.base_time.unwrap_or(0);
    let start_time = raw_replay.start_time.unwrap_or(base_time);

    let messages = raw_replay.messages;

    let end = messages.last().expect("No data").time / 100;
    let start = (start_time - base_time) / 100 - FIVE_MINS_IN_TENTHS;

    let mut out = String::new();
    let mut i = 0;
    for time in start..=end {
        let mut message_group = Vec::new();
        while let Some(message) = messages.get(i) {
            if message.time / 100 <= time {
                message_group.push(message);
                i += 1;
            } else {
                break;
            }
        }
        if time == start {
            out.push_str(&create_inital_message(message_group));
        } else {
            if message_group.is_empty() {
                out.push_str("{}");
            } else {
                out.push_str(&merge_messages(message_group, base_time));
            }
        }
        out.push('\n');
    }

    out
}
