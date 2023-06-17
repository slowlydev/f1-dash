use futures::{SinkExt, StreamExt};
use serde_json::Value;
use std::{
    collections::HashMap,
    env,
    io::Error as IoError,
    net::SocketAddr,
    sync::{Arc, Mutex},
};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{
    tungstenite::{Error, Message},
    MaybeTlsStream, WebSocketStream,
};

mod f1_models;
mod handler;
mod models;
mod socket;
mod utils;

pub type AppState = Arc<Mutex<HashMap<String, Value>>>;

#[tokio::main]
async fn main() {
    let address: String = env::args()
        .nth(1)
        .unwrap_or_else(|| "127.0.0.1:4000".to_string());

    let state: AppState = Arc::new(Mutex::new(HashMap::new()));

    let socket: Result<TcpListener, IoError> = TcpListener::bind(&address).await;
    let listener: TcpListener = socket.expect("Failed to bind to socket");

    while let Ok((stream, connection_address)) = listener.accept().await {
        tokio::spawn(handle_connection(stream, connection_address, state.clone()));
    }

    // Wait for the program to terminate
    tokio::signal::ctrl_c().await.unwrap();
}

async fn handle_connection(raw_stream: TcpStream, connection_address: SocketAddr, state: AppState) {
    println!("Incoming TCP connection from: {}", connection_address);

    let try_ws_stream: Result<WebSocketStream<TcpStream>, Error> =
        tokio_tungstenite::accept_async(raw_stream).await;

    let ws_stream: WebSocketStream<TcpStream> =
        try_ws_stream.expect("Error during the websocket handshake occurred");

    let (mut _tx, _) = ws_stream.split();

    println!("WebSocket connection established: {}", connection_address);

    // From here on OUR ws connection is fully setup, we now can do F1 ws stuff

    let try_f1_ws_stream: Result<WebSocketStream<MaybeTlsStream<TcpStream>>, Error> =
        socket::stream().await;

    let f1_ws_stream: WebSocketStream<MaybeTlsStream<TcpStream>> =
        try_f1_ws_stream.expect("Failed to connect to WebSocket");

    let (mut f1_tx, mut f1_rx) = f1_ws_stream.split();

    let f1_subscribe_request: Result<(), Error> =
        f1_tx.send(Message::Text(socket::subscribe_request())).await;

    f1_subscribe_request.expect("Failed to send subscription message");

    // Now we have BOTH WS connections setup and can start receiving, transforming and sending the data

    tokio::spawn(async move {
        while let Some(full_msg) = f1_rx.next().await {
            match full_msg {
                Ok(full_msg) => {
                    let try_full_data: Result<String, Error> = full_msg.into_text();
                    let full_data: String = try_full_data.expect("Failed to get msg");

                    handler::update_state(full_data, state.clone());
                }

                Err(e) => {
                    println!("WebSocket error: {:?}", e);
                    break;
                }
            }
        }
    });
}
