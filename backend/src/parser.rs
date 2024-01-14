use std::mem;

use chrono::{DateTime, NaiveDateTime, Utc};
use serde::Serialize;
use serde_json::Value;

// pub mod deserializer;
pub mod models;

#[derive(Debug)]
pub enum ParsedMessage {
    Updates(Vec<Update>),
    Replay(Value),
    Empty,
}

#[derive(Serialize, Debug)]
pub struct Update {
    pub catagory: String,
    pub state: Value,
    pub timestamp: chrono::DateTime<Utc>,
}

impl From<&mut models::Message> for Update {
    fn from(message: &mut models::Message) -> Update {
        let timestamp = chrono_date(&message.a.2).unwrap();

        Update {
            catagory: mem::take(&mut message.a.0),
            state: mem::take(&mut message.a.1),
            timestamp,
        }
    }
}

pub fn parse_message(message: String) -> ParsedMessage {
    let socket_message: models::SocketMessage =
        serde_json::from_str::<models::SocketMessage>(&message).unwrap();

    if let Some(mut messages) = socket_message.m {
        if messages.len() < 1 {
            return ParsedMessage::Empty;
        };

        let mut updates: Vec<Update> = messages.iter_mut().map(|msg| Update::from(msg)).collect();

        // TimingDataF1 is a dupe of TimingData
        updates.retain(|update| update.catagory != "TimingDataF1");

        return ParsedMessage::Updates(updates);
    };

    if let Some(Value::Object(mut replay)) = socket_message.r {
        // TimingDataF1 is a dupe of TimingData

        replay.retain(|k, _| k != "TimingDataF1");

        return ParsedMessage::Replay(serde_json::to_value(replay).unwrap());
    }

    ParsedMessage::Empty
}

const FORMAT1: &'static str = "%Y-%m-%dT%H:%M:%S%.3fZ";
const FORMAT2: &'static str = "%Y-%m-%dT%H:%M:%S";

pub fn chrono_date(s: &str) -> Option<DateTime<Utc>> {
    let dt = NaiveDateTime::parse_from_str(&s, FORMAT1)
        .or_else(|_| NaiveDateTime::parse_from_str(&s, FORMAT2))
        .ok()?;

    Some(DateTime::<Utc>::from_naive_utc_and_offset(dt, Utc))
}
