use std::sync::{Arc, Mutex};

use serde_json::{json, Value};
use tokio::sync::broadcast;

mod server;
mod state;

use env;
use tracing::level_filters::LevelFilter;

type LiveState = Arc<Mutex<Value>>;

#[derive(Clone)]
pub enum LiveEvent {
    Initial(String),
    Update(String),
}

impl LiveEvent {
    pub fn name(&self) -> &str {
        match self {
            LiveEvent::Initial(_) => "initial",
            LiveEvent::Update(_) => "update",
        }
    }

    pub fn inner(self) -> String {
        match self {
            LiveEvent::Initial(v) => v,
            LiveEvent::Update(v) => v,
        }
    }
}

#[tokio::main]
async fn main() {
    env::init();
    init_logs();

    let (tx, _rx) = broadcast::channel::<LiveEvent>(10);
    let state = Arc::new(Mutex::new(json!({})));

    state::manage(tx.clone(), state.clone());

    server::init(tx, state)
        .await
        .expect("http server setup failed");
}

fn init_logs() {
    let env_filter = tracing_subscriber::EnvFilter::builder()
        .with_default_directive(LevelFilter::INFO.into())
        .with_env_var("RUST_LOG")
        .from_env_lossy();

    tracing_subscriber::fmt().with_env_filter(env_filter).init();
}
