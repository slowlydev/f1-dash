use futures::stream::SplitSink;
use futures::SinkExt;
use serde_json::Value;
use std::{collections::HashMap, net::SocketAddr};
use tokio::net::TcpStream;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};
use tracing::{debug, info};

use crate::client::manager::ClientManagerEvent;
use crate::data::odctrl::Request;

type SenderSink = SplitSink<WebSocketStream<TcpStream>, Message>;

pub struct Connection {
    pub id: u32,
    pub initial: bool,
    pub realtime: bool,
    pub addr: SocketAddr,
    pub sender: SenderSink,
}

impl Connection {
    pub fn new(id: u32, addr: SocketAddr, sender: SenderSink) -> Connection {
        Connection {
            id,
            addr,
            initial: false,
            realtime: true,
            sender,
        }
    }
}

pub enum Event {
    Join(Connection),
    Quit(u32),

    // initial, updartes, reconstructed initial
    OutRealtime(Value),
    OutInitial(u32, Value),

    // timestamp requested reconstructed initial
    OutReconstruct(Value),

    // timestamp requested updates
    OutBuffer(Value),
}

// handles outgoing traffic from rdctrl
// handles requests regarding odctrl

// starts client with client manager when new connections
// kills client with client manager when no connection exists anymore

pub async fn init(
    mut rx: UnboundedReceiver<Event>,
    manager_tx: UnboundedSender<ClientManagerEvent>,
    odctrl_tx: UnboundedSender<Request>,
) {
    let mut connections: HashMap<u32, Connection> = HashMap::new();

    while let Some(event) = rx.recv().await {
        match event {
            Event::Join(conn) => {
                let id = conn.id.clone();
                connections.insert(conn.id, conn);
                let _ = manager_tx.send(ClientManagerEvent::Start);

                if connections.len() > 1 {
                    info!("new client connceted, requesting initial state!");
                    let _ = odctrl_tx.send(Request::Initial(id));
                }
            }
            Event::Quit(id) => {
                connections.remove(&id);
                debug!("connection lost: {}", id);

                if connections.len() < 1 {
                    info!("last client disconnected, killing socket!");
                    let _ = manager_tx.send(ClientManagerEvent::Kill);
                }
            }
            Event::OutRealtime(state) => {
                let data = serde_json::to_string(&state).unwrap();

                for (_, conn) in connections
                    .iter_mut()
                    .filter(|(_, conn)| conn.realtime && !conn.initial)
                {
                    let _ = conn.sender.send(Message::Text(data.clone())).await;
                }
            }
            Event::OutInitial(id, state) => {
                let data = serde_json::to_string(&state).unwrap();

                if let Some(conn) = connections.get_mut(&id) {
                    let _ = conn.sender.send(Message::Text(data)).await;
                    conn.initial = true;
                }
            }
            _ => {}
        }
    }
}
