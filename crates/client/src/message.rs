use data::transformer::{to_camel_case, transform};
use serde_json::Value;
use tokio_tungstenite::tungstenite::Utf8Bytes;
use tracing::trace;

#[derive(Clone)]
pub enum Message {
    Updates(Vec<(String, Value)>),
    Initial(Value),
}

pub fn parse(data: Utf8Bytes) -> Option<Message> {
    trace!(?data, "parsing message");

    let msg = serde_json::from_str::<Value>(&data).ok()?;

    if let Some(initial) = msg.pointer("/R") {
        let mut data = initial.clone();
        transform(&mut data);
        return Some(Message::Initial(data));
    };

    if let Some(Value::Array(updates)) = msg.pointer("/M") {
        if updates.len() < 1 {
            return None;
        }

        let mut ups = Vec::new();

        for update in updates {
            let Some(cat) = update.pointer("/A/0").and_then(|v| v.as_str()) else {
                continue;
            };

            let Some(data) = update.pointer("/A/1") else {
                continue;
            };

            let mut update_value = data.clone();

            transform(&mut update_value);

            ups.push((to_camel_case(cat), update_value));
        }

        return Some(Message::Updates(ups));
    }

    None
}
