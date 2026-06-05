use std::{env, str::FromStr};

use futures::{SinkExt, Stream};
use reqwest::{
    Url,
    header::{self, HeaderValue},
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tokio_stream::StreamExt;
use tokio_tungstenite::tungstenite::{Message, client::IntoClientRequest, http::Request};
use tracing::{debug, error, info, trace, warn};

/// ASCII Record Separator — used to delimit SignalR Core JSON messages.
const RECORD_SEPARATOR: char = '\x1e';

// ──────────────────────────── Negotiation ────────────────────────────

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

/// Perform the SignalR Core negotiation handshake.
///
/// 1. Pre-flight OPTIONS to obtain the AWSALBCORS cookie.
/// 2. POST to /negotiate to get the connection token.
async fn negotiate(base_url: &str) -> Result<Negotiation, anyhow::Error> {
    let negotiate_url = format!("https://{}/negotiate", base_url);

    // Step 1: OPTIONS pre-flight to get AWSALBCORS cookie
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

    // Step 2: POST negotiate with negotiateVersion=1
    let negotiate_url_with_params = Url::parse_with_params(
        &negotiate_url,
        &[("negotiateVersion", "1")],
    )?;

    let mut negotiate_req = client.post(negotiate_url_with_params);
    if !cookie.is_empty() {
        negotiate_req = negotiate_req.header(header::COOKIE, &cookie);
    }

    let res = negotiate_req.send().await?;
    let status = res.status();
    let body = res.text().await?;

    if body.trim().is_empty() {
        return Err(anyhow::anyhow!(
            "SignalR Core negotiate returned empty response (HTTP {status}). \
             There may be no active session."
        ));
    }

    let negotiation: NegotiationResponse = serde_json::from_str(&body)
        .map_err(|e| anyhow::anyhow!(
            "Failed to parse negotiate response: {e} — body: {}",
            &body[..body.len().min(300)]
        ))?;

    debug!(?negotiation, "negotiation complete");

    Ok(Negotiation {
        connection_token: negotiation.connection_token,
        cookie,
    })
}

// ──────────────────────────── WebSocket Types ────────────────────────────

type WsStream =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

pub struct SignalrClient {
    pub stream: WsStream,
}

// ──────────────────────────── Create Client ────────────────────────────

pub async fn create_client(base_url: &str, _hub: &str) -> Result<SignalrClient, anyhow::Error> {
    let negotiation = negotiate(base_url).await?;

    // Build the WebSocket URL
    let mut ws_url = Url::parse(&format!("wss://{}", base_url))?;

    if let Some(ref token) = negotiation.connection_token {
        ws_url.query_pairs_mut()
            .append_pair("id", token);
    }

    // Allow dev override
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

    // ── SignalR Core Handshake ──
    // Send: {"protocol":"json","version":1}\x1e
    let handshake = format!(
        "{}{}",
        serde_json::to_string(&serde_json::json!({"protocol": "json", "version": 1}))?,
        RECORD_SEPARATOR
    );

    stream.send(Message::text(handshake)).await?;

    // Receive handshake response (should be {}\x1e for success)
    let handshake_response = stream
        .next()
        .await
        .ok_or_else(|| anyhow::anyhow!("No handshake response"))??;

    if let Message::Text(txt) = &handshake_response {
        let trimmed = txt.trim_end_matches(RECORD_SEPARATOR);
        if !trimmed.is_empty() {
            let parsed: Value = serde_json::from_str(trimmed)?;
            if let Some(err) = parsed.get("error") {
                return Err(anyhow::anyhow!("SignalR Core handshake error: {}", err));
            }
        }
        debug!("handshake successful");
    } else {
        return Err(anyhow::anyhow!(
            "Unexpected handshake response type: {:?}",
            handshake_response
        ));
    }

    Ok(SignalrClient { stream })
}

// ──────────────────────────── SignalR Core Message Types ────────────────────────────

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct SignalRMessage {
    #[serde(rename = "type")]
    msg_type: i32,
    invocation_id: Option<String>,
    target: Option<String>,
    arguments: Option<Vec<Value>>,
    result: Option<Value>,
    error: Option<String>,
}

/// Message type constants (SignalR Core Hub Protocol)
const MSG_INVOCATION: i32 = 1;
const MSG_COMPLETION: i32 = 3;
const MSG_PING: i32 = 6;
const MSG_CLOSE: i32 = 7;

// ──────────────────────────── Subscribe ────────────────────────────

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct InvocationMessage {
    #[serde(rename = "type")]
    msg_type: i32,
    invocation_id: Option<String>,
    target: String,
    arguments: Vec<Value>,
}

pub async fn subscribe(
    client: &mut SignalrClient,
    topics: &[&str],
) -> Result<Value, anyhow::Error> {
    let invocation_id = "1".to_string();

    let invoke = InvocationMessage {
        msg_type: MSG_INVOCATION,
        invocation_id: Some(invocation_id.clone()),
        target: "Subscribe".to_string(),
        arguments: vec![Value::Array(
            topics.iter().map(|&t| Value::String(t.to_string())).collect(),
        )],
    };

    let msg = format!("{}{}", serde_json::to_string(&invoke)?, RECORD_SEPARATOR);
    client.stream.send(Message::text(msg)).await?;

    debug!("subscribe invocation sent, waiting for completion...");

    // Wait for the Completion response (type 3) with our invocation ID
    loop {
        let raw = client
            .stream
            .next()
            .await
            .ok_or_else(|| anyhow::anyhow!("Connection closed while waiting for subscribe response"))??;

        if let Message::Text(txt) = raw {
            for part in txt.split(RECORD_SEPARATOR) {
                let part = part.trim();
                if part.is_empty() {
                    continue;
                }

                let parsed: SignalRMessage = match serde_json::from_str(part) {
                    Ok(m) => m,
                    Err(e) => {
                        warn!("Failed to parse message during subscribe: {e}");
                        continue;
                    }
                };

                match parsed.msg_type {
                    MSG_PING => {
                        trace!("ping received during subscribe");
                        continue;
                    }
                    MSG_COMPLETION => {
                        // Check if this is our invocation
                        if parsed.invocation_id.as_deref() == Some(&invocation_id)
                            || env::var_os("F1_DEV_URL").is_some()
                        {
                            if let Some(err) = parsed.error {
                                return Err(anyhow::anyhow!("Subscribe failed: {}", err));
                            }
                            return Ok(parsed.result.unwrap_or(Value::Object(serde_json::Map::new())));
                        }
                    }
                    MSG_INVOCATION => {
                        // We might receive feed messages before the completion
                        trace!("received invocation during subscribe wait, ignoring");
                    }
                    _ => {
                        trace!(msg_type = parsed.msg_type, "ignoring message during subscribe");
                    }
                }
            }
        }
    }
}

// ──────────────────────────── Public Data Types ────────────────────────────

pub struct UpdateArgs {
    pub topic: String,
    pub data: serde_json::Value,
    pub timestamp: String,
}

// ──────────────────────────── Listen (structured) ────────────────────────────

/// Listen to WebSocket messages and parse them into structured UpdateArgs.
/// In SignalR Core, feed updates arrive as Invocation messages (type 1)
/// with target "feed" and arguments [topic, data, timestamp].
pub fn listen(client: SignalrClient) -> impl Stream<Item = Vec<UpdateArgs>> {
    client
        .stream
        .filter_map(|message| {
            trace!("message received");

            match message {
                Ok(Message::Text(txt)) => {
                    let mut all_updates = Vec::new();

                    for part in txt.split(RECORD_SEPARATOR) {
                        let part = part.trim();
                        if part.is_empty() {
                            continue;
                        }

                        let parsed: SignalRMessage = match serde_json::from_str(part) {
                            Ok(m) => m,
                            Err(_) => continue,
                        };

                        match parsed.msg_type {
                            MSG_INVOCATION => {
                                // Feed updates come as invocations with target "feed"
                                let target = parsed.target.as_deref().unwrap_or("");
                                if target != "feed" {
                                    trace!(target, "ignoring non-feed invocation");
                                    continue;
                                }

                                // Arguments format: [topic, data, timestamp]
                                // OR the arguments may be a single list: [[topic, data, timestamp]]
                                if let Some(args) = parsed.arguments {
                                    if args.len() == 3 {
                                        // Direct format: arguments = [topic, data, timestamp]
                                        let topic = args[0].as_str().unwrap_or("").to_string();
                                        let data = args[1].clone();
                                        let timestamp = args[2].as_str().unwrap_or("").to_string();
                                        if !topic.is_empty() {
                                            all_updates.push(UpdateArgs {
                                                topic,
                                                data,
                                                timestamp,
                                            });
                                        }
                                    } else if args.len() == 1 {
                                        // Wrapped format: arguments = [[topic, data, timestamp]]
                                        if let Some(inner) = args[0].as_array() {
                                            if inner.len() == 3 {
                                                let topic = inner[0].as_str().unwrap_or("").to_string();
                                                let data = inner[1].clone();
                                                let timestamp = inner[2].as_str().unwrap_or("").to_string();
                                                if !topic.is_empty() {
                                                    all_updates.push(UpdateArgs {
                                                        topic,
                                                        data,
                                                        timestamp,
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            MSG_PING => {
                                trace!("ping received");
                            }
                            MSG_CLOSE => {
                                if let Some(err) = parsed.error {
                                    error!("server closed connection: {}", err);
                                } else {
                                    info!("server closed connection gracefully");
                                }
                            }
                            _ => {
                                trace!(msg_type = parsed.msg_type, "ignoring message");
                            }
                        }
                    }

                    if all_updates.is_empty() {
                        None
                    } else {
                        Some(all_updates)
                    }
                }
                Ok(_) => None,
                Err(err) => {
                    error!(?err, "ws error");
                    None
                }
            }
        })
}

// ──────────────────────────── Listen Raw ────────────────────────────

/// Listen to raw WebSocket messages without parsing them.
/// Returns the raw text messages as-is, useful for saving to a file for replay.
pub fn listen_raw(client: SignalrClient) -> impl Stream<Item = String> {
    client.stream.filter_map(|message| {
        trace!("raw message received");

        match message {
            Ok(message) => match message {
                Message::Text(txt) => Some(txt.to_string()),
                _ => None,
            },
            Err(err) => {
                error!(?err, "ws error");
                None
            }
        }
    })
}
