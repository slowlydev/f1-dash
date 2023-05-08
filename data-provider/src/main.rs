use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tokio_tungstenite::tungstenite::Message;

// use zune_inflate::DeflateDecoder;
use scylla::{transport::errors::NewSessionError, Session, SessionBuilder};

mod message_handler;
mod models;
mod socket;
mod utils;

async fn connect_to_scylla() -> Result<Session, NewSessionError> {
    let uri = std::env::var("SCYLLA_URI").unwrap_or_else(|_| "127.0.0.1:9042".to_string());
    SessionBuilder::new().known_node(uri).build().await
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct SocketDataPayload {
    A: Vec<Value>,
    H: String,
    M: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct SocketData {
    C: Option<String>,
    M: Option<Vec<SocketDataPayload>>, // TODO test
    G: Option<String>,
    H: Option<String>,
    I: Option<String>,
}

#[tokio::main]
async fn main() {
    println!("Starting Server");

    let ws_stream = socket::stream()
        .await
        .expect("Failed to connect to WebSocket");

    println!("Connected to WebSocket");

    // tx: Sending
    // rx: Receiving
    let (mut tx, mut rx) = ws_stream.split();

    let session = connect_to_scylla()
        .await
        .expect("Failed to connect to ScyllaDB");

    println!("Connected to ScyllaDB");

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
                        // println!("handled msg");
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
