use reqwest::{header::HeaderMap, Result as ReqwestResult};
use serde::{Deserialize, Serialize};
use tokio::net::TcpStream;
use tokio_tungstenite::{
    connect_async,
    tungstenite::{client::IntoClientRequest, Error as TungsteniteError},
    MaybeTlsStream, WebSocketStream,
};

use crate::utils;

// let F1_BASE_URL = "ws://localhost:8000";
const F1_BASE_URL: &str = "wss://livetiming.formula1.com/signalr";
// TODO encode instead of predefined value
const F1_NEGOTIATE_URL: &str = "https://livetiming.formula1.com/signalr/negotiate?connectionData=%5B%7B%22name%22%3A%22Streaming%22%7D%5D&clientProtocol=1.5";

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

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct SubscriptionRequest {
    H: String,
    M: String,
    A: [[String; 16]; 1],
    I: u8,
}

async fn negotiate() -> ReqwestResult<(HeaderMap, NegotiateResult)> {
    let client: reqwest::Client = reqwest::Client::new();
    let res: reqwest::Response = client.get(F1_NEGOTIATE_URL).send().await?;
    let header: HeaderMap = res.headers().clone();
    let body: String = res.text().await?;
    let json: NegotiateResult = serde_json::from_str(&body).expect("Failed to convert to JSON");
    Ok((header, json))
}

fn url(token: String) -> String {
    let hub = utils::encode_uri_component("[{\"name\":\"Streaming\"}]");
    let token_encoded = utils::encode_uri_component(&token);

    format!("{F1_BASE_URL}/connect?clientProtocol=1.5&transport=webSockets&connectionToken={token_encoded}&connectionData={hub}")
}

pub fn subscribe_request() -> String {
    // maybe the structs owns everything?
    let request = SubscriptionRequest {
        H: "Streaming".to_owned(),
        M: "Subscribe".to_owned(),
        A: [[
            "Heartbeat".to_owned(),
            "CarData.z".to_owned(),
            "Position.z".to_owned(),
            "ExtrapolatedClock".to_owned(),
            "TopThree".to_owned(),
            "RcmSeries".to_owned(),
            "TimingStats".to_owned(),
            "TimingAppData".to_owned(),
            "WeatherData".to_owned(),
            "TrackStatus".to_owned(),
            "DriverList".to_owned(),
            "RaceControlMessages".to_owned(),
            "SessionInfo".to_owned(),
            "SessionData".to_owned(),
            "LapCount".to_owned(),
            "TimingData".to_owned(),
        ]]
        .to_owned(),
        I: 1,
    };

    let string_request: String =
        serde_json::to_string(&request).expect("Failed to create string out of request");

    return string_request;
}

pub async fn stream() -> Result<WebSocketStream<MaybeTlsStream<TcpStream>>, TungsteniteError> {
    let (negotiate_headers, negotiate_result) = negotiate().await.expect("Failed to negotiate");

    let ws_url: String = url(negotiate_result.ConnectionToken);

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
