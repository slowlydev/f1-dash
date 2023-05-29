use reqwest::{header::HeaderMap, Result as ReqwestResult};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::net::TcpStream;
use tokio_tungstenite::{
    connect_async,
    tungstenite::{client::IntoClientRequest, Error as TungsteniteError},
    MaybeTlsStream, WebSocketStream,
};

use crate::utils;

// let F1_BASE_URL = "ws://localhost:8000";
const F1_BASE_URL: &str = "wss://livetiming.formula1.com/signalr";
const F1_NEGOTIATE_URL: &str = "https://livetiming.formula1.com/signalr";

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct NegotiateResult {
    Url: String,
    ConnectionToken: String,
    ConnectionId: String,
    KeepAliveTimeout: f32,
    DisconnectTimeout: f32,
    ConnectionTimeout: f32,
    TryWebSockets: bool,
    ProtocolVersion: String,
    TransportConnectTimeout: f32,
    LongPollDelay: f32,
}

async fn negotiate() -> ReqwestResult<(HeaderMap, NegotiateResult)> {
    let hub = utils::encode_uri_component("[{\"name\":\"Streaming\"}]");
    let url = format!("{F1_NEGOTIATE_URL}/negotiate?connectionData={hub}&clientProtocol=1.5");

    let client: reqwest::Client = reqwest::Client::new();
    let res: reqwest::Response = client.get(url).send().await?;

    let header: HeaderMap = res.headers().clone();
    let body: String = res.text().await?;

    let json: NegotiateResult =
        serde_json::from_str(&body).expect("Failed to convert negotiate response to JSON");

    Ok((header, json))
}

fn url(token: String) -> String {
    let hub = utils::encode_uri_component("[{\"name\":\"Streaming\"}]");
    let token_encoded = utils::encode_uri_component(&token);

    format!("{F1_BASE_URL}/connect?clientProtocol=1.5&transport=webSockets&connectionToken={token_encoded}&connectionData={hub}")
}

pub fn subscribe_request() -> String {
    let request: serde_json::Value = json!({
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
        ]],
        "I": 1,
    });

    return request.to_string();
}

pub async fn stream() -> Result<WebSocketStream<MaybeTlsStream<TcpStream>>, TungsteniteError> {
    let (negotiate_headers, negotiate_result) = negotiate().await.expect("Failed to negotiate");

    let ws_url =
        std::env::var("DEV_WS_URL").unwrap_or_else(|_| url(negotiate_result.ConnectionToken));

    let mut request = ws_url
        .into_client_request()
        .expect("Failed to create request");

    let headers = request.headers_mut();
    headers.insert("User-Agent", "BestHTTP".parse().unwrap());
    headers.insert("Accept-Encoding", "gzip,identity".parse().unwrap());
    headers.insert("Cookie", negotiate_headers["set-cookie"].clone());

    let ws_stream = match connect_async(request).await {
        Ok((stream, _response)) => {
            println!("Handshake has been completed");
            // println!("Server response was {:?}", response);
            stream
        }
        Err(e) => {
            println!("WebSocket handshake failed with {e}!");
            return Err(e);
        }
    };

    Ok(ws_stream)
}
