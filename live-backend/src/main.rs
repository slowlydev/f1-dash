use std::sync::{Arc, Mutex};

use serde_json::{json, Value};
use tokio::sync::broadcast;

mod client;
mod db;
mod env;
mod keeper;
mod log;
mod server;
mod data {
    pub mod compression;
    pub mod merge;
    pub mod transformer;
}

type LiveState = Arc<Mutex<Value>>;

#[tokio::main]
async fn main() {
    env::init();
    log::init();

    let db = db::init().await.expect("failed to setup db");

    let (tx, _rx) = broadcast::channel::<server::live::LiveEvent>(10);
    let state = Arc::new(Mutex::new(json!({})));

    client::spawn_init(tx.clone(), state.clone());

    keeper::spawn_init(db.clone(), state.clone());

    server::init(db.clone(), tx.clone(), state)
        .await
        .expect("http server setup failed");

    db.close().await;
}
