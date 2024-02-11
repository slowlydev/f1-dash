use std::{
    mem,
    sync::{Arc, Mutex},
};

use broadcasting::BroadcastEvents;
use futures::StreamExt;

use history::History;
use tokio::sync::mpsc::{self};
use tokio::{net::TcpListener, sync::mpsc::UnboundedSender};
use tokio_tungstenite::tungstenite::Message;
use tracing::{error, info};

mod broadcasting;
mod client;
mod history;
mod log;
mod parser;
mod server;

#[tokio::main(flavor = "multi_thread", worker_threads = 15)]
async fn main() {
    log::init();

    let addr = "127.0.0.1:4000".to_string();

    let listener: TcpListener = TcpListener::bind(&addr)
        .await
        .expect("Listening to TCP failed");

    let history = Arc::new(Mutex::new(History::new()));

    /*
        broadcasting, handles all outgoing messages.
    */
    let (broadcast_sender, broadcast_receiver) = mpsc::unbounded_channel::<BroadcastEvents>();
    tokio::spawn(broadcasting::init(broadcast_receiver));

    /*
        start f1 client connection, updates history and sends realtime instantly
    */
    tokio::spawn(init_client(history.clone(), broadcast_sender.clone()));

    // Count and Id connections
    let mut id: u32 = 0;

    while let Ok((stream, addr)) = listener.accept().await {
        match tokio_tungstenite::accept_async(stream).await {
            Err(e) => error!("Websocket connection error : {}", e),
            Ok(stream) => {
                info!("new connection: {}", addr);

                id += 1;
                tokio::spawn(server::listen(stream, addr, id, broadcast_sender.clone()));
            }
        }
    }
}

async fn init_client(
    history: Arc<Mutex<History>>,
    broadcast_sender: UnboundedSender<BroadcastEvents>,
) {
    let client_result = client::Client::new().await;

    let Ok(mut client) = client_result else {
        error!("Failed to setup websocket client");
        return;
    };

    while let Some(msg) = client.socket.next().await {
        let msg = msg.unwrap();

        if let Message::Text(message) = msg {
            let mut parsed = parser::parse_message(message);

            let mut history = history.lock().unwrap();

            match parsed {
                parser::ParsedMessage::Empty => (),
                parser::ParsedMessage::Replay(state) => history.set_initial(state),
                parser::ParsedMessage::Updates(ref mut updates) => history.add_updates(updates),
            };

            if let Some(realtime) = history.get_realtime() {
                let _ = broadcast_sender.send(BroadcastEvents::OutRealtime(realtime));
            }

            mem::drop(history);
        }
    }
}
