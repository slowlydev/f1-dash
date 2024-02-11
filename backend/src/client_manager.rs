use futures::StreamExt;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tokio_tungstenite::tungstenite::Message;

use crate::client;

pub enum ClientManagerEvent {
    Kill,
    Start,
}

pub async fn init(
    mut manager_rx: UnboundedReceiver<ClientManagerEvent>,
    manager_tx: UnboundedSender<ClientManagerEvent>,
    client_tx: UnboundedSender<Message>,
) {
    // we need to be started on backend start
    // we need to be able to start and kill a ws
    // we need to handle disconnects

    let mut f1_client: Option<client::Client> = None;

    while let Some(event) = manager_rx.recv().await {
        match event {
            ClientManagerEvent::Kill => {
                if let Some(ref mut client) = f1_client {
                    let _ = client.socket.close(None).await;
                }
            }
            ClientManagerEvent::Start => {
                if f1_client.is_none() {
                    let client = client::Client::new().await;

                    match client {
                        Ok(client) => {
                            f1_client = Some(client);

                            if let Some(ref mut client) = f1_client {
                                while let Some(Ok(msg)) = client.socket.next().await {
                                    match msg {
                                        Message::Text(_) => {
                                            let _ = client_tx.send(msg);
                                        }
                                        Message::Close(_) => {
                                            let _ = manager_tx.send(ClientManagerEvent::Start);
                                        }
                                        _ => {}
                                    }
                                }
                            }
                        }
                        Err(_) => {
                            let _ = manager_tx.send(ClientManagerEvent::Start);
                        }
                    }
                }
            }
        }
    }
}
