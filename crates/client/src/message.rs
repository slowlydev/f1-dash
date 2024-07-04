use std::mem;

use serde_json::{Map, Value};
use tracing::trace;

pub enum Message {
    Updates(Vec<Map<String, Value>>),
    Initial(Value),
}

pub fn parse(data: String) -> Option<Message> {
    trace!("parsing message '{}'", data);

    let msg = serde_json::from_str::<Value>(&data).ok()?;

    if let Some(initial) = msg.pointer("/R") {
        return Some(Message::Initial(initial.clone()));
    };

    if let Some(Value::Array(updates)) = msg.pointer("/M") {
        if updates.len() < 1 {
            return None;
        }

        let mut ups = Vec::new();

        for update in updates {
            let cat = update.pointer("/A/0")?.as_str()?;
            let data = update.pointer("/A/1")?;

            let mut up = Map::new();
            up.insert(cat.to_owned(), data.clone());
            ups.push(up);
        }

        return Some(Message::Updates(ups));
    }

    mem::drop(msg); // idk why I put this here

    None
}
