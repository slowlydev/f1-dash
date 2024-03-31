use std::collections::HashMap;

use serde::Serialize;
use serde_json::Value;

use crate::{client, data::odctrl};

// TODO up next to add history here too

// -- rdctrl and odctrl --

#[derive(Serialize)]
pub struct InitialMessage {
    initial: Value,
}

pub fn create_initial(value: Value) -> InitialMessage {
    InitialMessage { initial: value }
}

// -- rdctrl only --

#[derive(Serialize)]
pub struct UpdateMessage {
    update: HashMap<String, Value>,
}

pub fn create_update(updates: HashMap<String, client::parser::Update>) -> UpdateMessage {
    let mut map: HashMap<String, Value> = HashMap::new();

    for (_, update) in updates.iter() {
        map.insert(update.category.clone(), update.state.clone());
    }

    UpdateMessage { update: map }
}

// -- odctrl only --

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DelayedInitialMessage {
    delayed_initial: Value,
}

pub fn create_delayed_initial(value: Value) -> DelayedInitialMessage {
    DelayedInitialMessage {
        delayed_initial: value,
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DelayedUpdatesMessage {
    delayed_updates: HashMap<String, Vec<Value>>,
}

pub fn create_delayed_updates(updates: Vec<odctrl::query::Update>) -> DelayedUpdatesMessage {
    let mut map: HashMap<String, Vec<Value>> = HashMap::new();

    for update in updates {
        let entry = map.entry(update.category).or_insert_with(Vec::new);
        entry.push(update.state);
    }

    DelayedUpdatesMessage {
        delayed_updates: map,
    }
}
