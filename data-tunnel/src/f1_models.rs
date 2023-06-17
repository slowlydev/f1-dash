use serde::{Deserialize, Serialize};
use serde_json::Value;

// GUYS I THINK THE STRUCTS ARE PUBLIC
// (╯°□°)╯︵ ┻━┻

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct SocketData {
    pub C: Option<String>,
    pub M: Option<Vec<SocketDataPayload>>,
    pub G: Option<String>,
    pub H: Option<String>,
    pub I: Option<String>,
    pub R: Option<Value>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct SocketDataPayload {
    pub A: Vec<Value>, // TODO fix
    pub H: String,
    pub M: String,
}
