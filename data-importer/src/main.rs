use futures::{SinkExt, StreamExt};
use tokio_tungstenite::tungstenite::Message;

use crate::live_timing_models::SocketData;

// use zune_inflate::DeflateDecoder;
mod live_timing_models;
mod message_handler;
mod models;
mod scylladb;
mod socket;
mod utils;

#[tokio::main]
async fn main() {
    println!("Starting Server");

    let session = scylladb::connect()
        .await
        .expect("Failed to connect to ScyllaDB");

    println!("Connected to ScyllaDB");

    scylladb::setup(&session).await;
    println!("Setup ScyllaDB");

    let ws_stream = socket::stream()
        .await
        .expect("Failed to connect to WebSocket");

    println!("Connected to WebSocket");

    // tx: Sending
    // rx: Receiving
    let (mut tx, mut rx) = ws_stream.split();

    tx.send(Message::Text(socket::subscribe_request()))
        .await
        .expect("Failed to send subscription message");

    // Spawn a task to read from the WebSocket and write to ScyllaDB
    tokio::spawn(async move {
        while let Some(msg) = rx.next().await {
            match msg {
                Ok(msg) => {
                    let data: String = msg
                        .into_text()
                        .expect("Failed to convert WebSocket Message to string");

                    // fix f1s incompatible JSON
                    let fixed_data = utils::fix_json(&data);

                    if let Ok(json_data) = serde_json::from_str::<SocketData>(&fixed_data) {
                        // handle message else where
                        // println!("JSON {:?}", json_data);

                        message_handler::handle(json_data, &session).await;
                    } else {
                        println!("Weird error");
                    };
                }

                Err(e) => {
                    println!("WebSocket error: {:?}", e);
                    break;
                }
            }
        }
    });

    // Wait for the program to terminate
    tokio::signal::ctrl_c().await.unwrap();
}
