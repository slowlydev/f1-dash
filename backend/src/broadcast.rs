use futures::SinkExt;
use serde_json::Value;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};
use tracing::{debug, info};

use std::{collections::HashMap, net::SocketAddr};

use futures::stream::SplitSink;

use tokio::net::TcpStream;

use crate::client::manager::ClientManagerEvent;

type SenderSink = SplitSink<WebSocketStream<TcpStream>, Message>;

pub struct Connection {
    pub id: u32,
    pub realtime: bool,
    pub addr: SocketAddr,
    pub sender: SenderSink,
}

impl Connection {
    pub fn new(id: u32, addr: SocketAddr, sender: SenderSink) -> Connection {
        Connection {
            id,
            addr,
            realtime: true,
            sender,
        }
    }
}

pub enum Event {
    Join(Connection),
    Quit(u32),

    ReqRealtime,
    ReqInitial,

    OutInitial(Value),
    OutUpdate(Value),

    OutReconstruct(),
    OutBuffer(),
}

// handles outgoing traffic from rdctrl
// handles requests regarding odctrl

// starts client with client manager when new connections
// kills client with client manager when no connection exists anymore

pub async fn init(
    mut rx: UnboundedReceiver<Event>,
    manager_tx: UnboundedSender<ClientManagerEvent>,
) {
    let mut connections: HashMap<u32, Connection> = HashMap::new();

    while let Some(event) = rx.recv().await {
        match event {
            Event::Join(conn) => {
                connections.insert(conn.id, conn);

                let _ = manager_tx.send(ClientManagerEvent::Start);
            }
            Event::Quit(id) => {
                connections.remove(&id);
                debug!("connection lost: {}", id);

                if connections.len() < 1 {
                    info!("last client disconnected, killing socket!");
                    let _ = manager_tx.send(ClientManagerEvent::Kill);
                }
            }
            Event::OutUpdate(state) => {
                let data = serde_json::to_string(&state).unwrap();

                for (_, conn) in connections.iter_mut().filter(|(_, conn)| conn.realtime) {
                    let _ = conn.sender.send(Message::Text(data.clone())).await;
                }
            }
            _ => {}
        }
    }
}
