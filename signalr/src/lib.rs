use std::{env, str::FromStr};

use futures::{SinkExt, Stream};
use reqwest::{
    Url,
    header::{self, HeaderValue},
};
use serde::{Deserialize, Serialize, de::DeserializeOwned};
use serde_json::Value;
use tokio_stream::StreamExt;
use tokio_tungstenite::tungstenite::{Message, client::IntoClientRequest, http::Request};
use tracing::{debug, error, info};
use uuid::Uuid;

const RECORD_SEPARATOR: &str = "\u{001E}";

const INVOCATION: i32 = 1;
const COMPLETION: i32 = 3;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NegotiationResponse {
    pub connection_token: Option<String>,
    pub connection_id: Option<String>,
    pub negotiate_version: Option<i32>,
}

struct Negotiation {
    connection_token: Option<String>,
    cookie: String,
}

async fn negotiate(base_url: &str) -> Result<Negotiation, anyhow::Error> {
    let negotiate_url = format!("https://{}/negotiate", base_url);
    let client = reqwest::Client::new();

    let options_res = client
        .request(reqwest::Method::OPTIONS, &negotiate_url)
        .send()
        .await?;

    let cookie = options_res
        .cookies()
        .find(|c| c.name() == "AWSALBCORS")
        .map(|c| format!("AWSALBCORS={}", c.value()))
        .unwrap_or_default();

    debug!(?cookie, "obtained AWSALBCORS cookie");

    let url = Url::parse_with_params(&negotiate_url, &[("negotiateVersion", "1")])?;
    let mut req = client.post(url);
    if !cookie.is_empty() {
        req = req.header(header::COOKIE, &cookie);
    }

    let res = req.send().await?;
    let status = res.status();
    let body = res.text().await?;

    if body.trim().is_empty() {
        return Err(anyhow::anyhow!(
            "SignalR negotiate returned empty response (HTTP {status})"
        ));
    }

    let negotiation: NegotiationResponse = serde_json::from_str(&body).map_err(|e| {
        anyhow::anyhow!(
            "Failed to parse negotiate response: {e} — body: {}",
            &body[..body.len().min(300)]
        )
    })?;

    debug!(?negotiation, "negotiation complete");

    Ok(Negotiation {
        connection_token: negotiation.connection_token,
        cookie,
    })
}

type WsStream =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

pub struct SignalrClient {
    pub stream: WsStream,
}

pub async fn create_client(base_url: &str, _hub: &str) -> Result<SignalrClient, anyhow::Error> {
    let negotiation = negotiate(base_url).await?;

    let mut ws_url = Url::parse(&format!("wss://{}", base_url))?;
    if let Some(ref token) = negotiation.connection_token {
        ws_url.query_pairs_mut().append_pair("id", token);
    }

    let ws_url = match env::var_os("F1_DEV_URL") {
        Some(env_url) => Url::from_str(&env_url.into_string().unwrap())?,
        None => ws_url,
    };

    info!("connecting to {ws_url}");

    let mut req: Request<()> = ws_url.into_client_request()?;

    let headers = req.headers_mut();
    headers.insert(header::USER_AGENT, HeaderValue::from_static("BestHTTP"));
    headers.insert(
        header::ACCEPT_ENCODING,
        HeaderValue::from_static("gzip,identity"),
    );
    if !negotiation.cookie.is_empty() {
        headers.insert(header::COOKIE, negotiation.cookie.parse()?);
    }

    let (mut stream, res) = tokio_tungstenite::connect_async(req).await?;
    debug!(?res, "ws connected");

    let json = serialize(&serde_json::json!({"protocol": "json", "version": 1}))?;
    stream.send(Message::text(json)).await?;

    let handshake_response = stream
        .next()
        .await
        .ok_or_else(|| anyhow::anyhow!("No handshake response"))??;

    match &handshake_response {
        Message::Text(txt) => {
            let msg = deserialize::<Value>(&txt);

            match msg {
                Ok(parsed) => {
                    if let Some(err) = parsed.get("error") {
                        return Err(anyhow::anyhow!("SignalR handshake error: {}", err));
                    }
                    debug!("handshake successful");
                }
                Err(e) => {
                    return Err(anyhow::anyhow!("Failed to parse handshake response: {}", e));
                }
            }
        }
        _ => {
            return Err(anyhow::anyhow!(
                "Unexpected handshake response type: {:?}",
                handshake_response
            ));
        }
    }

    Ok(SignalrClient { stream })
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Completion {
    r#type: i32,
    invocation_id: String,
    result: Option<Value>,
    error: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct InvocationMessage {
    r#type: i32,
    invocation_id: String,
    target: String,
    arguments: Vec<Value>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct FeedMessage {
    r#type: i32,
    target: String,
    arguments: (String, Value, String),
}

pub async fn subscribe(
    client: &mut SignalrClient,
    topics: &[&str],
) -> Result<Value, anyhow::Error> {
    let invocation_id = Uuid::new_v4().to_string();

    let invoke = InvocationMessage {
        r#type: INVOCATION,
        invocation_id: invocation_id.clone(),
        target: "Subscribe".to_string(),
        arguments: vec![Value::Array(
            topics
                .iter()
                .map(|&t| Value::String(t.to_string()))
                .collect(),
        )],
    };

    let json = serialize(&invoke)?;

    client.stream.send(Message::text(json)).await?;

    debug!("subscribe invocation sent, waiting for completion...");

    loop {
        let response = client
            .stream
            .next()
            .await
            .ok_or_else(|| anyhow::anyhow!("No response received from server"))??;

        let Message::Text(txt) = response else {
            continue;
        };

        for msg in split_messages(&txt) {
            let Ok(completion) = deserialize::<Completion>(msg) else {
                continue;
            };

            if completion.r#type != COMPLETION || completion.invocation_id != invocation_id {
                continue;
            }

            if let Some(error) = completion.error {
                return Err(anyhow::anyhow!("Server error: {}", error));
            }

            return completion
                .result
                .ok_or_else(|| anyhow::anyhow!("No result received"));
        }
    }
}

fn serialize<T>(value: &T) -> Result<String, serde_json::Error>
where
    T: ?Sized + Serialize,
{
    let serialized = serde_json::to_string(value)?;
    Ok(serialized + RECORD_SEPARATOR)
}

fn deserialize<T: DeserializeOwned>(input: &str) -> Result<T, serde_json::Error> {
    let stripped = strip_record_separator(input);
    serde_json::from_str(stripped)
}

fn split_messages(input: &str) -> Vec<&str> {
    input
        .split(RECORD_SEPARATOR)
        .filter(|item| !item.trim().is_empty())
        .collect()
}

fn strip_record_separator(input: &str) -> &str {
    input.trim_end_matches(RECORD_SEPARATOR)
}

pub struct UpdateArgs {
    pub topic: String,
    pub data: serde_json::Value,
    pub timestamp: String,
}

pub fn listen(client: SignalrClient) -> impl Stream<Item = Vec<UpdateArgs>> {
    client.stream.filter_map(|message| match message {
        Ok(Message::Text(txt)) => {
            let messages = split_messages(&txt);

            if messages.is_empty() {
                return None;
            }

            let mut results = Vec::new();

            for msg in messages {
                let invocation = match deserialize::<FeedMessage>(msg) {
                    Ok(invocation) => invocation,
                    Err(err) => {
                        debug!(?err, frame = msg, "skipping non-feed signalr frame");
                        continue;
                    }
                };

                if invocation.r#type != INVOCATION || invocation.target != "feed" {
                    continue;
                }

                let (topic, data, timestamp) = invocation.arguments;

                results.push(UpdateArgs {
                    topic,
                    data,
                    timestamp,
                });
            }

            if results.is_empty() {
                return None;
            }

            Some(results)
        }
        Ok(_) => None,
        Err(err) => {
            error!(?err, "ws error");
            None
        }
    })
}

pub fn listen_raw(client: SignalrClient) -> impl Stream<Item = String> {
    client.stream.filter_map(|message| match message {
        Ok(Message::Text(txt)) => Some(txt.to_string()),
        Ok(_) => None,
        Err(err) => {
            error!(?err, "ws error");
            None
        }
    })
}
