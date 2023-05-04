use std::net::SocketAddr;
use std::sync::Arc;

use tokio::sync::Mutex;
use tokio_tungstenite::connect_async;

use scylla::{Session, SessionBuilder};

const F1_URL: &str = "livetiming.formula1.com/signalr";

#[tokio::main]
async fn main() {
    // Set up the WebSocket connection
    let addr: SocketAddr = "localhost:8080".parse().unwrap();
    let (ws_stream, _) = connect_async(format!("ws://{}", addr))
        .await
        .expect("Failed to connect to WebSocket");

    // Set up the ScyllaDB connection
    let session = connect_to_scylla()
        .await
        .expect("Failed to connect to ScyllaDB");

    // Set up a mutex-protected buffer to hold received messages
    let messages = Arc::new(Mutex::new(Vec::new()));

    // ws_stream.send();

    // Spawn a task to read from the WebSocket and write to ScyllaDB
    tokio::spawn(async move {
        while let Some(msg) = ws_stream.next().await {
            match msg {
                Ok(msg) => {
                    // Store the received message in the buffer
                    let mut messages = messages.lock().await;
                    messages.push(msg.to_string());

                    // Write the received message to ScyllaDB
                    let message = msg.into_text().unwrap();
                    session
                        .query("INSERT INTO messages (message) VALUES (?)", message)
                        .await
                        .expect("Failed to write message to ScyllaDB");
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

async fn connect_to_scylla() -> Result<Session, Box<(dyn std::error::Error + 'static)>> {
    let uri = std::env::var("SCYLLA_URI").unwrap_or_else(|_| "127.0.0.1:9042".to_string());

    SessionBuilder::new().known_node(uri).build().await
}
