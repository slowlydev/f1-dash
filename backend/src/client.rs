use futures::SinkExt;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

use tokio::net::TcpStream;
use tokio_tungstenite::{
    connect_async,
    tungstenite::{client::IntoClientRequest, http::Request, Message},
    MaybeTlsStream, WebSocketStream,
};
use tracing::{debug, info};

const F1_BASE_URL: &str = "livetiming.formula1.com/signalr";

pub mod manager;
pub mod parser;

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

pub struct Client {
    pub socket: WebSocketStream<MaybeTlsStream<TcpStream>>,
}

impl Client {
    pub async fn new() -> Result<Client, anyhow::Error> {
        debug!("creating new client");

        let (cookie, token) = negotiate().await?;
        let req = create_request(&cookie, &token)?;
        let (socket, _) = connect_async(req).await?;

        let mut client = Client { socket };
        client.subscribe().await?;
        Ok(client)
    }

    async fn subscribe(&mut self) -> anyhow::Result<()> {
        debug!("subscribing to socket");

        let request: Value = json!({
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
                "PitLaneTimeCollection"
            ]],
            "I": 1,
        });

        self.socket.send(Message::Text(request.to_string())).await?;

        Ok(())
    }
}

async fn negotiate() -> Result<(String, String), anyhow::Error> {
    let hub = create_hub();
    let url = format!("https://{F1_BASE_URL}/negotiate?connectionData={hub}&clientProtocol=1.5");
    let res = reqwest::get(url).await?;

    let cookie = get_header_key(res.headers(), "set-cookie");
    let token = serde_json::from_str::<NegotiateResult>(&res.text().await?)?;

    Ok((cookie, token.connection_token))
}

fn create_hub() -> String {
    let json: &Value = &json!([{ "name": "Streaming" }]);
    encode_uri_component(&json.to_string())
}

fn get_header_key(header: &reqwest::header::HeaderMap, key: &str) -> String {
    header.get(key).unwrap().to_str().unwrap().to_owned()
}

fn encode_uri_component(s: &str) -> String {
    let mut encoded: String = String::new();
    for ch in s.chars() {
        match ch {
            '-' | '_' | '.' | '!' | '~' | '*' | '\'' | '(' | ')' => {
                encoded.push(ch);
            }
            '0'..='9' | 'a'..='z' | 'A'..='Z' => {
                encoded.push(ch);
            }
            _ => {
                for b in ch.to_string().as_bytes() {
                    encoded.push_str(format!("%{:X}", b).as_str());
                }
            }
        }
    }
    encoded
}

fn create_url(token: &str) -> String {
    if let Some(env_url) = std::env::var_os("WS_URL") {
        if let Ok(env_url) = env_url.into_string() {
            info!("using env for F1 URL {env_url}");
            return env_url;
        };
    };

    let hub: String = create_hub();
    let encoded_token: String = encode_uri_component(token);

    format!("wss://{F1_BASE_URL}/connect?clientProtocol=1.5&transport=webSockets&connectionToken={encoded_token}&connectionData={hub}")
}

fn create_request(cookie: &str, token: &str) -> Result<Request<()>, anyhow::Error> {
    let url = create_url(&token);
    let mut req: Request<()> = url.into_client_request()?;

    let headers = req.headers_mut();
    headers.insert("User-Agent", "BestHTTP".parse().unwrap());
    headers.insert("Accept-Encoding", "gzip,identity".parse().unwrap());
    headers.insert("Cookie", cookie.parse().unwrap());

    Ok(req)
}
