// create server message
// - initial updates
// - history from updates

use std::collections::HashMap;

use serde::Serialize;

use crate::db;

use super::transformer;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct UpdateMessage {
    pub updates: transformer::Updates,
    pub history: Option<HashMap<String, db::history::History>>,
}

pub fn create_update_message(updates: transformer::Updates) -> UpdateMessage {
    // TODO create history updates out of updates

    UpdateMessage {
        updates,
        history: None,
    }
}
