use std::{
    mem,
    sync::{Arc, Mutex},
};

use futures::{SinkExt, StreamExt};
use serde_json::Value;

use tokio_tungstenite::{accept_async, tungstenite::Message};
use tracing::{debug, error};

mod client;
mod history;
mod log;
mod merge;
mod parser;
mod server;

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(log::get_level())
        .init();

    // setup channels
    let (mut realtime_tx, realtime_rx) = spmc::channel::<Option<Value>>();

    // setup history
    let history: Arc<Mutex<history::History>> = Arc::new(Mutex::new(history::History::new()));

    let history_recive = Arc::clone(&history);

    // setup f1 connetion and send to history
    tokio::spawn(async move {
        let client_result = client::Client::new().await;

        let Ok(mut client) = client_result else {
            error!("Failed to setup websocket client");
            return;
        };

        while let Some(msg) = client.socket.next().await {
            let msg = msg.unwrap();

            if let Message::Text(message) = msg {
                let mut parsed = parser::parse_message(message);

                let mut hist = history_recive.lock().unwrap();

                match parsed {
                    parser::ParsedMessage::Empty => (),
                    parser::ParsedMessage::Replay(state) => hist.set_intitial(state),
                    parser::ParsedMessage::Updates(ref mut updates) => hist.add_updates(updates),
                };

                debug!("sending history to realtime");

                let _ = realtime_tx.send(hist.get_realtime());
                mem::drop(hist);
            }
        }
    });

    // start ws server
    let server_result = server::Server::new().await;

    let Ok(server) = server_result else {
        error!("Failed to setup websocket server");
        return;
    };

    while let Ok((stream, addr)) = server.listener.accept().await {
        debug!("got connection from: {}", addr);

        let realtime_rx = realtime_rx.clone();

        tokio::spawn(async move {
            let ws_stream = accept_async(stream)
                .await
                .expect("Error during the websocket handshake occurred");

            debug!("got handshake from: {}", addr);

            let (mut outgoing, _) = ws_stream.split();

            while let Ok(msg) = realtime_rx.recv() {
                if let Some(msg) = msg {
                    let text = serde_json::to_string(&msg).unwrap();
                    let _ = outgoing.send(Message::Text(text)).await;
                }
            }
        });
    }
}
