use tokio::sync::mpsc::{self};

mod broadcast;
pub mod messages;
pub mod data {
    pub mod odctrl;
    pub mod rdctrl;
}
mod client;
mod db;
mod log;
mod server;

use broadcast::Event;
use client::manager::ClientManagerEvent;
use client::parser::ParsedMessage;
use data::odctrl::Request;

#[tokio::main(flavor = "multi_thread", worker_threads = 20)]
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

    let (broadcast_tx, broadcast_rx) = mpsc::unbounded_channel::<Event>();

    /*
        handles requests for older updates,
        handles reconstruction of initial states for the frontend
    */
    let (odctrl_tx, odctrl_rx) = mpsc::unbounded_channel::<Request>();
    tokio::spawn(data::odctrl::init(
        db.clone(),
        odctrl_rx,
        broadcast_tx.clone(),
    ));

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
        handles all outgoing messages.
        requests older data from odctrl when requested
    */
    tokio::spawn(broadcast::init(broadcast_rx, manager_tx, odctrl_tx));

    /*
        start ws server,
        listen to messages,
        send messages
    */
    server::listen(broadcast_tx.clone()).await;

    db.close().await;
}
