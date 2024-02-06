use std::{
    mem,
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};

use broadcasting::BroadcastEvents;
use futures::StreamExt;

use history::History;
use tokio::sync::mpsc::{self, UnboundedReceiver};
use tokio::{net::TcpListener, sync::mpsc::UnboundedSender};
use tokio_tungstenite::tungstenite::Message;
use tracing::{debug, error, info};

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
        handle removing and adding delays
    */
    let (delays_sender, delays_receiver) = mpsc::unbounded_channel::<DelayEvents>();
    tokio::spawn(handle_delay(history.clone(), delays_receiver));

    /*
        broadcasting, handles all outgoing messages.
    */
    let (broadcast_sender, broadcast_receiver) = mpsc::unbounded_channel::<BroadcastEvents>();
    tokio::spawn(broadcasting::init(broadcast_receiver, delays_sender));

    /*
        start f1 client connection, updates history and sends realtime instantly
    */
    tokio::spawn(init_client(history.clone(), broadcast_sender.clone()));

    /*
        start delay handling, runs delay computation and sends events for delays
    */
    let broadcast_sender_s = broadcast_sender.clone();
    thread::spawn(move || delay_stream(history.clone(), broadcast_sender_s));

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

enum DelayEvents {
    Remove(i64),
    Request(i64),
}

async fn handle_delay(
    history: Arc<Mutex<History>>,
    mut delays_receiver: UnboundedReceiver<DelayEvents>,
) {
    while let Some(event) = delays_receiver.recv().await {
        let mut history = history.lock().unwrap();

        match event {
            DelayEvents::Remove(delay) => {
                history.delay_states.remove(&delay);
            }
            DelayEvents::Request(delay) => {
                let _ = history.get_delayed(&delay);
            }
        }
    }
}

fn delay_stream(history: Arc<Mutex<History>>, broadcast_sender: UnboundedSender<BroadcastEvents>) {
    loop {
        let mut history = history.lock().unwrap();

        let updates = history.get_all_delayed();
        mem::drop(history);

        for (delay, state) in updates {
            debug!("client sending delayed message");
            let _ = broadcast_sender.send(BroadcastEvents::OutDelayed(delay, state));
        }

        thread::sleep(Duration::from_millis(10));
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
