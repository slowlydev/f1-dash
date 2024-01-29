use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tokio::net::TcpStream;
use tokio_tungstenite::{
    connect_async, tungstenite::client::IntoClientRequest, MaybeTlsStream, WebSocketStream,
};

use crate::utils;

// let F1_BASE_URL = "ws://localhost:8000";
const F1_BASE_URL: &str = "wss://livetiming.formula1.com/signalr";
const F1_NEGOTIATE_URL: &str = "livetiming.formula1.com/signalr";

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct NegotiateResult {
    url: String,
    connection_token: String,
    connection_id: String,
    keep_alive_timeout: f32,
    disconnect_timeout: f32,
    connection_timeout: f32,
    try_web_sockets: bool,
    protocol_version: String,
    transport_connect_timeout: f32,
    long_poll_delay: f32,
}

async fn negotiate() -> Result<(String, String), anyhow::Error> {
    let hub = create_hub();
    let url =
        format!("https://{F1_NEGOTIATE_URL}/negotiate?connectionData={hub}&clientProtocol=1.5");
    let res = reqwest::get(url).await?;

    let cookie = get_header_key(res.headers(), "set-cookie");
    let token = serde_json::from_str::<NegotiateResult>(&res.text().await?)?;

    Ok((cookie, token.connection_token))
}

fn create_hub() -> String {
    let json: &Value = &json!([{ "name": "Streaming" }]);
    utils::encode_uri_component(&json.to_string())
}

fn get_header_key(header: &reqwest::header::HeaderMap, key: &str) -> String {
    header.get(key).unwrap().to_str().unwrap().to_owned()
}

fn url(token: String) -> String {
    let hub = utils::encode_uri_component("[{\"name\":\"Streaming\"}]");
    let token_encoded = utils::encode_uri_component(&token);

    format!("{F1_BASE_URL}/connect?clientProtocol=1.5&transport=webSockets&connectionToken={token_encoded}&connectionData={hub}")
}

pub fn subscribe_request() -> String {
    let request: serde_json::Value =
        json!({
            "H": "Streaming",
            "M": "Subscribe",
            "A": [[
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
                "DriverList",
                "RaceControlMessages",
                "SessionInfo",
                "SessionData",
                "LapCount",
                "TimingData",
                "TeamRadio",
                "TimingDataF1",
                "LapSeries",
                "PitLaneTimeCollection",
                "TlaRcm"
            ]],
            "I": 1,
        });

    return request.to_string();
}

pub async fn stream() -> Result<WebSocketStream<MaybeTlsStream<TcpStream>>, anyhow::Error> {
    let (cookie, token) = negotiate().await?;

    let ws_url = std::env::var("DEV_WS_URL").unwrap_or_else(|_| url(token));

    let mut request = ws_url
        .into_client_request()
        .expect("Failed to create request");

    let headers = request.headers_mut();
    headers.insert("User-Agent", "BestHTTP".parse().unwrap());
    headers.insert("Accept-Encoding", "gzip,identity".parse().unwrap());
    headers.insert("Cookie", cookie.parse().unwrap());

    let (ws_stream, _) = connect_async(request).await?;

    Ok(ws_stream)
}
