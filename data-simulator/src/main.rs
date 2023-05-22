use std::{
    collections::HashMap,
    env,
    fs::File,
    io::{BufRead, BufReader, Error as IoError},
    net::SocketAddr,
    sync::{Arc, Mutex},
    time::Duration,
};

use futures_channel::mpsc::{unbounded, UnboundedSender};
use futures_util::{SinkExt, StreamExt};

use tokio::{
    net::{TcpListener, TcpStream},
    time::sleep,
};

use tokio_tungstenite::tungstenite::protocol::Message;

type Tx = UnboundedSender<Message>;
type PeerMap = Arc<Mutex<HashMap<SocketAddr, Tx>>>;

async fn handle_connection(peer_map: PeerMap, raw_stream: TcpStream, addr: SocketAddr) {
    println!("Incoming TCP connection from: {}", addr);

    let ws_stream = tokio_tungstenite::accept_async(raw_stream)
        .await
        .expect("Error during the websocket handshake occurred");
    println!("WebSocket connection established: {}", addr);

    // Insert the write part of this peer to the peer map.
    let (tx, _) = unbounded();
    peer_map.lock().unwrap().insert(addr, tx);

    let (mut outgoing, _) = ws_stream.split();

    // Open the file
    let file = File::open("data.txt").unwrap();
    let reader = BufReader::new(file);

    // Send each line of the file as a new message
    for line in reader.lines() {
        sleep(Duration::from_millis(5)).await;
        let message = Message::Text(line.unwrap().to_string());
        outgoing.send(message).await.expect("Failed to send line");
    }

    println!("{} disconnected", &addr);
    peer_map.lock().unwrap().remove(&addr);
}

#[tokio::main]
async fn main() -> Result<(), IoError> {
    tracing_subscriber::fmt::init();

    let addr = env::args()
        .nth(1)
        .unwrap_or_else(|| "127.0.0.1:8000".to_string());

    let state = PeerMap::new(Mutex::new(HashMap::new()));

    // Start the WebSocket server
    let try_socket = TcpListener::bind(&addr).await;
    let listener = try_socket.expect("Failed to bind");
    println!("Listening");

    while let Ok((stream, addr)) = listener.accept().await {
        tokio::spawn(handle_connection(state.clone(), stream, addr));
    }

    Ok(())
}
