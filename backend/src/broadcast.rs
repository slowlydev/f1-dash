use chrono::{DateTime, Utc};
use serde_json::Value;
use std::{collections::HashMap, net::SocketAddr};

use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tokio_tungstenite::tungstenite::Message;
use tracing::{debug, info, warn};

use crate::client::manager::ClientManagerEvent;
use crate::data::odctrl::{self, Request};
use crate::{client, messages};

// type SenderSink = SplitSink<WebSocketStream<TcpStream>, Message>;
type ConnectionTx = futures::channel::mpsc::UnboundedSender<Message>;

#[derive(Debug)]
pub struct Connection {
    pub id: u32,
    pub initial: bool,
    pub realtime: bool,
    pub addr: SocketAddr,
    pub tx: ConnectionTx,
}

impl Connection {
    pub fn new(id: u32, addr: SocketAddr, tx: ConnectionTx) -> Connection {
        Connection {
            id,
            addr,
            initial: false,
            realtime: true,
            tx,
        }
    }
}

pub enum Event {
    Join(Connection),
    Quit(u32),

    // very first initial
    OutFirstInitial(Value),
    // messages::InitialMessage

    // reconstructed initial when new clients connect
    OutInitial(u32, Value),
    // messages::InitialMessage

    // realtime updates
    OutUpdate(HashMap<String, client::parser::Update>),
    // messages::UpdateMessage

    // timestamp requested 'computed' initial
    OutReconstruct(u32, Value),
    // messages::DelayedInitialMessage

    // timestamp requested updates
    OutRequestedUpdates(u32, Vec<odctrl::query::Update>),
    // messages::DelayedUpdatesMessage

    // Requests
    RequestReconstruct(u32, DateTime<Utc>), // realtime false
    RequestUpdates(u32, DateTime<Utc>, DateTime<Utc>), // realtime false
    RequestRealtime(u32),                   // realtime true
}

// handles outgoing traffic from rdctrl
// handles requests regarding odctrl

// starts client with client manager when new connections
// kills client with client manager when no connection exists anymore

// TODO make sends async
// TODO refactor duplicate code

pub async fn init(
    mut rx: UnboundedReceiver<Event>,
    manager_tx: UnboundedSender<ClientManagerEvent>,
    odctrl_tx: UnboundedSender<Request>,
) {
    info!("starting...");

    let mut connections: HashMap<u32, Connection> = HashMap::new();

    while let Some(event) = rx.recv().await {
        match event {
            Event::Join(mut conn) => {
                let id = conn.id.clone();

                if connections.len() == 0 {
                    info!("first connection, setting initial true");
                    conn.initial = true;
                }

                connections.insert(conn.id, conn);

                let _ = manager_tx.send(ClientManagerEvent::Start);

                if connections.len() > 1 {
                    debug!("new client connected, requesting initial state!");
                    let _ = odctrl_tx.send(Request::Initial(id));
                }

                info!("current connections: {}", connections.len());
            }
            Event::Quit(id) => {
                connections.remove(&id);
                debug!("connection lost: {}", id);

                if connections.len() < 1 {
                    info!("last client disconnected, killing socket!");
                    let _ = manager_tx.send(ClientManagerEvent::Kill);
                }
            }
            Event::OutFirstInitial(state) => {
                let msg = messages::create_initial(state);
                let text = serde_json::to_string(&msg);

                match text {
                    Ok(text) => {
                        for (_, conn) in connections.iter_mut() {
                            if !conn.realtime && conn.initial {
                                continue;
                            }

                            let _ = conn.tx.unbounded_send(Message::Text(text.clone()));
                        }
                    }
                    Err(_) => warn!("failed to serialize first initial to json"),
                }
            }
            Event::OutInitial(id, state) => {
                let msg = messages::create_initial(state);
                let text = serde_json::to_string(&msg);

                match text {
                    Ok(text) => {
                        if let Some(conn) = connections.get_mut(&id) {
                            conn.initial = true;
                            let _ = conn.tx.unbounded_send(Message::Text(text));
                        }
                    }
                    Err(_) => warn!("failed to serialize initial to json"),
                }
            }
            Event::OutUpdate(updates) => {
                let msg = messages::create_update(updates);
                let text = serde_json::to_string(&msg);

                match text {
                    Ok(text) => {
                        for (_, conn) in connections.iter_mut() {
                            if !conn.realtime && conn.initial {
                                continue;
                            }

                            let _ = conn.tx.unbounded_send(Message::Text(text.clone()));
                        }
                    }
                    Err(_) => warn!("failed to serialize update to json"),
                }
            }
            Event::OutReconstruct(id, state) => {
                let msg = messages::create_delayed_initial(state);
                let text = serde_json::to_string(&msg);

                match text {
                    Ok(text) => {
                        if let Some(conn) = connections.get_mut(&id) {
                            conn.realtime = false;
                            let _ = conn.tx.unbounded_send(Message::Text(text));
                        }
                    }
                    Err(_) => warn!("failed to serialize delayed initial to json"),
                }
            }
            Event::OutRequestedUpdates(id, updates) => {
                let msg = messages::create_delayed_updates(updates);
                let text = serde_json::to_string(&msg);

                match text {
                    Ok(text) => {
                        if let Some(conn) = connections.get_mut(&id) {
                            conn.realtime = false;
                            let _ = conn.tx.unbounded_send(Message::Text(text));
                        }
                    }
                    Err(_) => warn!("failed to serialize delayed updates to json"),
                }
            }
            Event::RequestReconstruct(id, timestamp) => {
                let _ = odctrl_tx.send(Request::Reconstruct(id, timestamp));

                if let Some(conn) = connections.get_mut(&id) {
                    conn.realtime = false;
                }
            }
            Event::RequestUpdates(id, start, end) => {
                let _ = odctrl_tx.send(Request::Updates(id, start, end));

                if let Some(conn) = connections.get_mut(&id) {
                    conn.realtime = false;
                }
            }
            Event::RequestRealtime(id) => {
                if let Some(conn) = connections.get_mut(&id) {
                    conn.realtime = true;
                }

                // when switching to realtime, make sure the client
                // gets the latest realtime state
                let _ = odctrl_tx.send(Request::Initial(id));
            }
        }
    }
}
