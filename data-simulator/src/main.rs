use std::{
    collections::HashMap,
    env,
    fs::File,
    io::{BufRead, BufReader, Error as IoError},
    net::SocketAddr,
    sync::{Arc, Mutex},
    time::Duration,
};

use rand::seq::SliceRandom;

use futures_channel::mpsc::{unbounded, UnboundedSender};
use futures_util::{SinkExt, StreamExt};

use tokio::{
    net::{TcpListener, TcpStream},
    time::sleep,
};

use tokio_tungstenite::tungstenite::protocol::Message;

type Tx = UnboundedSender<Message>;
type PeerMap = Arc<Mutex<HashMap<SocketAddr, Tx>>>;

fn random_duration() -> Duration {
    let mut durations = vec![
        Duration::from_millis(10),
        Duration::from_millis(50),
        Duration::from_millis(30),
        Duration::from_millis(167),
        Duration::from_millis(200),
        Duration::from_millis(277),
    ];

    let mut rng = rand::thread_rng();

    durations.shuffle(&mut rng);
    durations.get(0).unwrap().to_owned()
}

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

    let arg_path = env::args()
        .nth(1)
        .expect("Failed to get data file, please add as an argument");

    // Open the file
    let file = File::open(arg_path).unwrap();
    let reader = BufReader::new(file);

    // Send each line of the file as a new message
    for line in reader.lines() {
        sleep(random_duration()).await;
        let message = Message::Text(line.unwrap().to_string());
        outgoing.send(message).await.expect("Failed to send line");
    }

    println!("{} disconnected", &addr);
    peer_map.lock().unwrap().remove(&addr);
}

#[tokio::main]
async fn main() -> Result<(), IoError> {
    tracing_subscriber::fmt::init();

    let addr = "127.0.0.1:8000".to_string();

    let state = PeerMap::new(Mutex::new(HashMap::new()));

    // Start the WebSocket server
    let try_socket = TcpListener::bind(&addr).await;
    let listener = try_socket.expect("Failed to bind");
    println!("Listening on {}", addr);

    while let Ok((stream, addr)) = listener.accept().await {
        tokio::spawn(handle_connection(state.clone(), stream, addr));
    }

    Ok(())
}
