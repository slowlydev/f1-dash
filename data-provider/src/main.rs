use futures::{SinkExt, StreamExt};
use serde_json::Value;
use tokio_tungstenite::tungstenite::Message;

// use zune_inflate::DeflateDecoder;
// use scylla::{transport::errors::NewSessionError, Session, SessionBuilder};

mod socket;
mod utils;

// async fn connect_to_scylla() -> Result<Session, NewSessionError> {
//     let uri = std::env::var("SCYLLA_URI").unwrap_or_else(|_| "127.0.0.1:9042".to_string());
//     SessionBuilder::new().known_node(uri).build().await
// }

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

    // let session = connect_to_scylla()
    //     .await
    //     .expect("Failed to connect to ScyllaDB");
    // println!("Connected to ScyllaDB");

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

                    let fixed_data = utils::fix_json(&data);

                    let message: Value =
                        serde_json::from_str(&fixed_data).expect("Failed to parse message to JSON");

                    // println!("Message Type {}", message[0]);

                    // if message[0].is_string() && message[0].includes() {
                    //     let mut decoder = DeflateDecoder::new(&message.as_bytes());
                    //     let decompressed = decoder.decode_zlib().expect("Failed to decode");
                    //     message = String::from_utf8_lossy(&decompressed).to_string();
                    // }

                    println!("{}", message)
                }

                Err(e) => {
                    eprintln!("WebSocket error: {:?}", e);
                    break;
                }
            }
        }
    });

    // Wait for the program to terminate
    tokio::signal::ctrl_c().await.unwrap();
}
