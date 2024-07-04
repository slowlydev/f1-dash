use std::{env, error::Error};

use axum::http::HeaderValue;

use futures::SinkExt;
use reqwest::{header, Url};
use serde_json::Value;
use tokio_stream::Stream;

use tokio_stream::StreamExt;
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::{tungstenite::http::Request, MaybeTlsStream, WebSocketStream};
use tracing::{debug, trace};

pub use tokio_tungstenite::tungstenite;

mod consts;
pub mod message;

type WsStream = WebSocketStream<MaybeTlsStream<tokio::net::TcpStream>>;

pub async fn parse_stream(stream: WsStream) -> impl Stream<Item = message::Message> {
    stream.filter_map(|msg| msg.ok()).filter_map(|msg| {
        match msg {
            tungstenite::Message::Text(txt) => message::parse(txt),
            tungstenite::Message::Close(_) => None, // how do i break out of the while let loop?
            _ => None,
        }
    })
}

pub async fn init() -> Result<WsStream, Box<dyn Error>> {
    let req = create_request().await?;

    debug!("created request");

    trace!("request='{:?}'", req);

    let (mut socket, _) = tokio_tungstenite::connect_async(req).await?;

    debug!("connected");

    socket
        .send(tungstenite::Message::text(consts::SIGNALR_SUBSCRIBE))
        .await?;

    debug!("subscribed");

    Ok(socket)
}

async fn create_request() -> Result<Request<()>, Box<dyn Error>> {
    trace!("creating request");

    match env_url() {
        Some(url) => Ok(url.into_client_request()?),
        None => {
            trace!("no url detected");

            let negotiation = negotiate().await?;

            trace!(
                "token='{}' cookie='{}'",
                negotiation.token,
                negotiation.cookie
            );

            let url = Url::parse_with_params(
                &format!("wss://{}/connect", consts::F1_BASE_URL),
                &[
                    ("clientProtocol", "1.5"),
                    ("transport", "webSockets"),
                    ("connectionToken", &negotiation.token),
                    ("connectionData", &consts::SIGNALR_HUB),
                ],
            )?;

            trace!("url='{}'", url);

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
    trace!("negotiating");

    let url = Url::parse_with_params(
        &format!("https://{}/negotiate", consts::F1_BASE_URL),
        &[
            ("clientProtocol", "1.5"),
            ("connectionData", &consts::SIGNALR_HUB),
        ],
    )?;

    let res = reqwest::get(url).await?;

    // TODO refactor this
    let headers = res.headers().clone();
    let body = res.text().await?;
    let json = serde_json::from_str::<Value>(&body)?;

    trace!("negotiation response='{}'", json);

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

fn env_url() -> Option<Url> {
    let env_url = env::var_os("WS_URL")?.into_string().ok()?;
    Some(Url::parse(&env_url).ok()?)
}
