use client_manager::ClientManagerEvent;

use tokio::net::TcpListener;
use tokio::sync::mpsc::{self};
use tokio_tungstenite::tungstenite::Message;
use tracing::{error, info};

mod client;
mod client_manager;
mod db;
mod history;
mod log;
mod parser;
mod server;
mod server_manager;

#[tokio::main(flavor = "multi_thread", worker_threads = 15)]
async fn main() {
    log::init();

    let addr = "127.0.0.1:4000".to_string();

    let listener: TcpListener = TcpListener::bind(&addr)
        .await
        .expect("Listening to TCP failed");

    let (client_tx, client_rx) = mpsc::unbounded_channel::<Message>();

    /*
        manage f1 client connection, restarts on close, closes on no clients
    */
    let (manager_tx, manager_rx) = mpsc::unbounded_channel::<ClientManagerEvent>();
    tokio::spawn(client_manager::init(
        manager_rx,
        manager_tx.clone(),
        client_tx.clone(),
    ));

    // /*
    //     broadcasting, handles all outgoing messages.
    // */
    // let (broadcast_sender, broadcast_receiver) = mpsc::unbounded_channel::<BroadcastEvents>();
    // tokio::spawn(server_manager::init(broadcast_receiver));

    // // Count and Id connections
    let mut id: u32 = 0;

    while let Ok((stream, addr)) = listener.accept().await {
        match tokio_tungstenite::accept_async(stream).await {
            Err(e) => error!("Websocket connection error : {}", e),
            Ok(stream) => {
                info!("new connection: {}", addr);

                id += 1;
                // tokio::spawn(server::listen(stream, addr, id, broadcast_sender.clone()));
            }
        }
    }
}

// let mut parsed = parser::parse_message(message);

//             let mut history = history.lock().unwrap();

//             match parsed {
//                 parser::ParsedMessage::Empty => (),
//                 parser::ParsedMessage::Replay(state) => history.set_initial(state),
//                 parser::ParsedMessage::Updates(ref mut updates) => history.add_updates(updates),
//             };

//             if let Some(realtime) = history.get_realtime() {
//                 let _ = broadcast_sender.send(BroadcastEvents::OutRealtime(realtime));
//             }
