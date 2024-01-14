use serde::Deserialize;
use serde_json::Value;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub struct SocketMessage {
    pub m: Option<Vec<Message>>,
    pub r: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub struct Message {
    pub a: (String, Value, String),
}
