use futures::{channel::mpsc, pin_mut, StreamExt};
use futures_util::stream::SplitStream;
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
    let addr = "0.0.0.0:4000".to_string();
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

    let handle_receiver = tokio::spawn(handle_reciving(receiver));
    let handle_sender = rx.map(Ok).forward(sender);

    pin_mut!(handle_receiver, handle_sender);
    tokio::select! {
        _ = handle_receiver => {},
         _ = handle_sender => {}
    }

    let _ = broadcast_tx.send(broadcast::Event::Quit(id));

    debug!("we are gonna disconnect, hopefully");
}

async fn handle_reciving(mut receiver: SplitStream<WebSocketStream<TcpStream>>) {
    while let Some(Ok(msg)) = receiver.next().await {
        match msg {
            Message::Close(_) => {
                debug!("got close frame, aborting");
                break;
            }
            Message::Text(txt) => {
                info!("{txt:?}");
            }
            _ => {}
        }
    }
}
