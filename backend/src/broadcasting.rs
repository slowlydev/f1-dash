use futures::SinkExt;
use serde_json::Value;
use tokio::sync::mpsc::UnboundedReceiver;
use tokio_tungstenite::tungstenite::Message;
use tracing::debug;

use std::{collections::HashMap, net::SocketAddr};

use futures::stream::SplitSink;

use tokio::net::TcpStream;
use tokio_tungstenite::WebSocketStream;

type SenderSink = SplitSink<WebSocketStream<TcpStream>, Message>;

pub struct Connection {
    pub id: u32,
    pub delay: i64,
    pub addr: SocketAddr,
    pub sender: SenderSink,
}

impl Connection {
    pub fn new(id: u32, addr: SocketAddr, sender: SenderSink) -> Connection {
        Connection {
            id,
            addr,
            delay: 0,
            sender,
        }
    }
}

pub enum BroadcastEvents {
    Join(Connection),
    Quit(u32),
    OutRealtime(Value),
}

pub async fn init(mut rx: UnboundedReceiver<BroadcastEvents>) {
    let mut connections: HashMap<u32, Connection> = HashMap::new();

    while let Some(event) = rx.recv().await {
        match event {
            BroadcastEvents::Join(conn) => {
                connections.insert(conn.id, conn);
            }
            BroadcastEvents::Quit(id) => {
                connections.remove(&id);
                debug!("connection lost: {}", id);
            }
            BroadcastEvents::OutRealtime(state) => {
                let data = serde_json::to_string(&state).unwrap();

                for (_, conn) in connections.iter_mut().filter(|(_, conn)| conn.delay == 0) {
                    let _ = conn.sender.send(Message::Text(data.clone())).await;
                }
            }
        }
    }
}
