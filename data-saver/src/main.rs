use futures::{SinkExt, StreamExt};
use tokio_tungstenite::tungstenite::Message;

mod socket;
mod utils;

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

                    println!("{}", data);
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
