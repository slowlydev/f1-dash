use std::time::Duration;

use futures::StreamExt;
use tokio::{
    sync::mpsc::{Receiver, Sender},
    time::sleep,
};
use tokio_tungstenite::tungstenite::Message;
use tokio_util::sync::CancellationToken;
use tracing::{debug, error, info, warn};

use crate::client;

use super::parser::{self, ParsedMessage};

pub enum ClientManagerEvent {
    Kill,
    Start,
}

pub async fn init(
    mut manager_rx: Receiver<ClientManagerEvent>,
    manager_tx: Sender<ClientManagerEvent>,
    client_tx: Sender<ParsedMessage>,
) {
    info!("starting...");
    // we need to be started on backend start
    // we need to be able to start and kill a ws
    // we need to handle disconnects

    let mut client_token: Option<CancellationToken> = None;

    while let Some(event) = manager_rx.recv().await {
        match event {
            ClientManagerEvent::Kill => {
                debug!("killing socket");

                if let Some(ref token) = client_token {
                    token.cancel();
                    client_token = None;
                }
            }
            ClientManagerEvent::Start => {
                debug!("received start event");

                if let Some(_) = client_token {
                    debug!("socket already exists");
                    continue;
                }

                info!("delegating start of f1 client");

                let token = CancellationToken::new();
                client_token = Some(token.clone());

                let manager_tx = manager_tx.clone();
                let client_tx = client_tx.clone();

                tokio::spawn(async move {
                    tokio::select! {
                        _ = token.cancelled() => {}
                        _ = client_loop(manager_tx, client_tx, token.clone()) => {}
                    }
                });
            }
        }
    }

    error!("client manager crashed, will not respond to manage messages anymore");
}

async fn client_loop(
    manager_tx: Sender<ClientManagerEvent>,
    client_tx: Sender<ParsedMessage>,
    token: CancellationToken,
) {
    Box::pin(async move {
        info!("starting f1 client");
        let mut client = client::Client::new().await;

        match client {
            Ok(ref mut client) => {
                while let Some(msg) = client.socket.next().await {
                    match msg {
                        Ok(msg) => match msg {
                            Message::Text(text) => {
                                let parsed = parser::message(text);
                                let _ = client_tx.send(parsed).await;
                            }
                            Message::Close(_) => {
                                debug!("got close, restarting");
                                break;
                            }
                            _ => {}
                        },
                        Err(_) => {
                            debug!("error while getting message, restarting");
                            break;
                        }
                    }
                }

                warn!("stopped receiving messages, restarting");
            }
            Err(_) => {
                warn!("failed to start, restarting");
            }
        }

        sleep(Duration::from_secs(2)).await;

        tokio::select! {
            _ = token.cancelled() => {},
            _ = client_loop(manager_tx, client_tx, token.clone()) => {}
        }
    })
    .await;
}
