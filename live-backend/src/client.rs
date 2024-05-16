use std::{env, error::Error, mem, thread, time::Duration};

use axum::http::HeaderValue;
use futures::SinkExt;
use reqwest::{header, Url};
use serde_json::Value;

use tokio::{sync::broadcast::Sender, time::sleep};
use tokio_stream::StreamExt;
use tokio_tungstenite::{
    tungstenite::{client::IntoClientRequest, http::Request, Message},
    MaybeTlsStream, WebSocketStream,
};
use tracing::{debug, error, info, trace};

use crate::{
    data::{compression, merge::merge, transformer},
    server::live::LiveEvent,
    LiveState,
};

mod consts;
mod message;
mod utils;

type Stream = WebSocketStream<MaybeTlsStream<tokio::net::TcpStream>>;

pub fn spawn_init(tx: Sender<LiveEvent>, state: LiveState) {
    thread::spawn(move || {
        let rt = tokio::runtime::Runtime::new().unwrap();

        rt.block_on(async {
            loop {
                if tx.receiver_count() < 2 {
                    debug!("no connections yet, retrying in 5 seconds");
                    sleep(Duration::from_secs(5)).await;
                    continue;
                }

                info!("starting client...");

                let stream = init().await;

                let Ok(stream) = stream else {
                    error!("client setup failed, restarting in 5 seconds");
                    sleep(Duration::from_secs(5)).await;
                    continue;
                };

                handle_stream(tx.clone(), stream, state.clone()).await;

                info!("client stopped, restarting in 5 seconds");

                sleep(Duration::from_secs(5)).await;
            }
        });
    });
}

pub async fn handle_stream(tx: Sender<LiveEvent>, mut stream: Stream, state: LiveState) {
    while let Some(Ok(msg)) = stream.next().await {
        match msg {
            Message::Text(txt) => {
                let message = message::parse(txt);

                // todo detect if session name changed if so, kill the while let loop

                let Some(message) = message else {
                    debug!("message was empty");
                    continue;
                };

                match message {
                    message::Message::Updates(mut updates) => {
                        debug!("recived update");

                        let mut state = state.lock().unwrap();

                        for update in updates.iter_mut() {
                            let update = transformer::transform_map(update);

                            if let Some(new_session_name) = update.pointer("sessionInfo/name") {
                                let current_session_name = state
                                    .pointer("sessionInfo/name")
                                    .expect("we always should have a session name");

                                if new_session_name != current_session_name {
                                    info!("session name changed, restarting client");
                                    return;
                                }
                            }

                            let Some(update_compressed) = compression::deflate(update.to_string())
                            else {
                                error!("failed compressing update");
                                continue;
                            };

                            trace!("update compressed='{}'", update_compressed);

                            match tx.send(LiveEvent::Update(update_compressed)) {
                                Ok(_) => debug!("update sent"),
                                Err(e) => {
                                    error!("failed sending update: {}", e)
                                }
                            };

                            merge(&mut state, update)
                        }

                        mem::drop(state);
                    }
                    message::Message::Initial(mut initial) => {
                        debug!("recived initial");

                        transformer::transform(&mut initial);

                        // check if this unwrap needs to be handled
                        let mut state = state.lock().unwrap();
                        *state = initial.clone();
                        mem::drop(state);

                        let Some(initial) = compression::deflate(initial.to_string()) else {
                            error!("failed compressing update");
                            continue;
                        };

                        trace!("initial compressed='{}'", initial);

                        match tx.send(LiveEvent::Initial(initial)) {
                            Ok(_) => debug!("initial sent"),
                            Err(e) => {
                                error!("failed sending initial: {}", e)
                            }
                        };
                    }
                }
            }
            Message::Close(_) => break,
            _ => {}
        };
    }
}

pub async fn init() -> Result<Stream, Box<dyn Error>> {
    let req = create_request().await?;

    let (mut socket, _) = tokio_tungstenite::connect_async(req).await?;

    socket
        .send(Message::text(consts::SIGNALR_SUBSCRIBE))
        .await?;

    Ok(socket)
}

async fn create_request() -> Result<Request<()>, Box<dyn Error>> {
    match env_url() {
        Some(url) => Ok(url.into_client_request()?),
        None => {
            let negotiation = negotiate().await?;
            let url = create_url(&negotiation.token)?;

            let mut req: Request<()> = url.into_client_request()?;

            let headers = req.headers_mut();
            headers.insert(
                header::USER_AGENT, // asd
                HeaderValue::from_static("BestHTTP"),
            );
            headers.insert(
                header::ACCEPT_ENCODING,
                HeaderValue::from_static("gzip,identity"),
            );
            headers.insert(
                header::COOKIE, //asd
                negotiation.cookie.parse().unwrap(),
            );

            Ok(req)
        }
    }
}

struct Negotiaion {
    token: String,
    cookie: String,
}

async fn negotiate() -> Result<Negotiaion, Box<dyn Error>> {
    let url = format!(
        "https://{}/negotiate?connectionData={}&clientProtocol=1.5",
        consts::F1_BASE_URL,
        utils::encode_uri_component(consts::SIGNALR_HUB)
    );

    let res = reqwest::get(url).await?;

    // TODO refactor this
    let headers = res.headers().clone();
    let body = res.text().await?;
    let json = serde_json::from_str::<Value>(&body)?;

    Ok(Negotiaion {
        token: json["ConnectionToken"]
            .as_str()
            .unwrap_or_default()
            .to_string(),
        cookie: headers[header::SET_COOKIE]
            .to_str()
            .unwrap_or_default()
            .to_string(),
    })
}

fn create_url(token: &str) -> Result<Url, Box<dyn Error>> {
    let hub = utils::encode_uri_component(consts::SIGNALR_HUB);
    let encoded_token = utils::encode_uri_component(token);

    Ok(Url::parse_with_params(
        &format!("wss://{}/connect", consts::F1_BASE_URL),
        &[
            ("clientProtocol", "1.5"),
            ("transport", "webSockets"),
            ("connectionToken", &encoded_token),
            ("connectionData", &hub),
        ],
    )?)
}

fn env_url() -> Option<Url> {
    let env_url = env::var_os("WS_URL")?.into_string().ok()?;
    Some(Url::parse(&env_url).ok()?)
}
