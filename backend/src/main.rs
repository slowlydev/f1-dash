use tokio::sync::mpsc::{self};

mod broadcast;
pub mod data {
    // pub mod odctrl;
    pub mod rdctrl;
}
mod client;
mod db;
mod log;
mod server;

use broadcast::Event;
use client::manager::ClientManagerEvent;
use client::parser::ParsedMessage;

#[tokio::main(flavor = "multi_thread")]
async fn main() {
    log::init();

    let db = db::init().await.expect("db setup failed");

    /*
        manage f1 client connection,
        restarts on close,
        closes on no clients
    */
    let (manager_tx, manager_rx) = mpsc::unbounded_channel::<ClientManagerEvent>();
    let (client_tx, client_rx) = mpsc::unbounded_channel::<ParsedMessage>();
    tokio::spawn(client::manager::init(
        manager_rx,
        manager_tx.clone(),
        client_tx,
    ));

    /*
        handles all outgoing messages.
    */
    let (broadcast_tx, broadcast_rx) = mpsc::unbounded_channel::<Event>();
    tokio::spawn(broadcast::init(broadcast_rx, manager_tx));

    /*
        split R,
        transform updates,
        handle DB inserts,
        create history out of updates
    */
    tokio::spawn(data::rdctrl::init(
        db.clone(),
        client_rx,
        broadcast_tx.clone(),
    ));

    /*
        handles requests for older updates,
        handles reconstruction of initial states for the frontend
    */
    // tokio::spawn(data::odctrl::init(initial_rx));

    /*
        start ws server,
        listen to messages,
        send messages
    */
    server::listen(broadcast_tx.clone()).await;

    db.close().await;
}
