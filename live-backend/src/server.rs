use chrono::{DateTime, Utc};
use futures::{channel::mpsc, pin_mut, StreamExt};
use futures_util::stream::SplitStream;
use serde::Deserialize;
use std::net::SocketAddr;
use tokio::{
    net::{TcpListener, TcpStream},
    sync::mpsc::UnboundedSender,
};

use tokio_tungstenite::{
    tungstenite::{extensions::DeflateConfig, protocol::WebSocketConfig, Message},
    WebSocketStream,
};
use tracing::{debug, error, info};

use crate::broadcast;

pub async fn listen(broadcast_tx: UnboundedSender<broadcast::Event>) {
    let default_addr = "0.0.0.0:4000".to_string();
    let addr = std::env::var("BACKEND_ADDRESS").unwrap_or(default_addr);

    info!("starting on {}...", addr);

    let listener = TcpListener::bind(&addr).await.expect("TCP failed");

    let mut id: u32 = 0;

    let config = WebSocketConfig {
        compression: Some(DeflateConfig::default()),
        ..Default::default()
    };

    while let Ok((stream, addr)) = listener.accept().await {
        match tokio_tungstenite::accept_async_with_config(stream, Some(config)).await {
            Err(e) => error!("Websocket connection error : {}", e),
            Ok(stream) => {
                id += 1;
                debug!("new connection: {} {}", addr, id);
                tokio::spawn(accept(stream, addr, id, broadcast_tx.clone()));
            }
        }
    }
}

async fn accept(
    stream: WebSocketStream<TcpStream>,
    addr: SocketAddr,
    id: u32,
    broadcast_tx: UnboundedSender<broadcast::Event>,
) {
    let (tx, rx) = mpsc::unbounded();

    let (sender, receiver) = stream.split();
    let conn = broadcast::Connection::new(id, addr, tx);
    let _ = broadcast_tx.send(broadcast::Event::Join(conn));

    let handle_receiver = tokio::spawn(handle_receiving(receiver, id, broadcast_tx.clone()));
    let handle_sender = rx.map(Ok).forward(sender);

    pin_mut!(handle_receiver, handle_sender);
    tokio::select! {
        _ = handle_receiver => {},
        _ = handle_sender => {}
    }

    let _ = broadcast_tx.send(broadcast::Event::Quit(id));

    debug!("we are gonna disconnect, hopefully");
}

async fn handle_receiving(
    mut receiver: SplitStream<WebSocketStream<TcpStream>>,
    id: u32,
    broadcast_tx: UnboundedSender<broadcast::Event>,
) {
    while let Some(Ok(msg)) = receiver.next().await {
        match msg {
            Message::Close(_) => {
                debug!("got close frame, aborting");
                break;
            }
            Message::Text(txt) => {
                // identify the message into requesting delayed initial or requesting delayed updates

                let Ok(msg) = serde_json::from_str::<ClientMessage>(&txt) else {
                    error!("failed to parse message");
                    continue;
                };

                debug!("{msg:?}");

                match msg {
                    ClientMessage::RequestReconstruct { timestamp } => {
                        info!("requesting reconstruct: {:?}", timestamp);
                        let event = broadcast::Event::RequestReconstruct(id, timestamp);
                        let _ = broadcast_tx.send(event);
                    }
                    ClientMessage::RequestUpdates { start, end } => {
                        info!("requesting updates: {:?} - {:?}", start, end);
                        let event = broadcast::Event::RequestUpdates(id, start, end);
                        let _ = broadcast_tx.send(event);
                    }
                    ClientMessage::RequestRealtime { realtime } => {
                        if realtime {
                            info!("requesting realtime");
                            let event = broadcast::Event::RequestRealtime(id);
                            let _ = broadcast_tx.send(event);
                        }
                    }
                }
            }
            _ => {}
        }
    }
}

#[derive(Deserialize, Debug)]
#[serde(untagged)]
enum ClientMessage {
    RequestReconstruct {
        timestamp: DateTime<Utc>,
    },
    RequestUpdates {
        start: DateTime<Utc>,
        end: DateTime<Utc>,
    },
    RequestRealtime {
        realtime: bool,
    },
}
