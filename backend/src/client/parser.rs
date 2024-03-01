use std::{collections::HashMap, mem};

use chrono::Utc;
use serde::Serialize;
use serde_json::Value;

pub mod models;

#[derive(Debug, Clone)]
pub enum ParsedMessage {
    Updates(HashMap<String, Update>),
    Initial(HashMap<String, Value>),
    Empty,
}

#[derive(Serialize, Debug, Clone)]
pub struct Update {
    pub category: String,
    pub state: Value,
    pub timestamp: chrono::DateTime<Utc>,
}

impl From<&mut models::Message> for Update {
    fn from(message: &mut models::Message) -> Update {
        let timestamp = chrono::Utc::now();

        Update {
            category: mem::take(&mut message.a.0),
            state: mem::take(&mut message.a.1),
            timestamp,
        }
    }
}

pub fn message(message: String) -> ParsedMessage {
    let socket_message: models::SocketMessage =
        serde_json::from_str::<models::SocketMessage>(&message).unwrap();

    if let Some(messages) = socket_message.m {
        if messages.len() < 1 {
            return ParsedMessage::Empty;
        };

        let mut updates: HashMap<String, Update> = HashMap::new();

        for mut message in messages {
            let update = Update::from(&mut message);
            updates.insert(update.category.clone(), update);
        }

        // TimingDataF1 is a dupe of TimingData
        updates.retain(|k, _| k != "TimingDataF1");

        if updates.len() < 1 {
            return ParsedMessage::Empty;
        };

        return ParsedMessage::Updates(updates);
    };

    if let Some(initial) = socket_message.r {
        if let Ok(mut initial) = serde_json::from_value::<HashMap<String, Value>>(initial) {
            // TimingDataF1 is a dupe of TimingData
            initial.retain(|k, _| k != "TimingDataF1");

            if initial.len() < 1 {
                return ParsedMessage::Empty;
            };

            return ParsedMessage::Initial(initial);
        }
    }

    ParsedMessage::Empty
}
