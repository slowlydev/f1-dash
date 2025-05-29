use std::sync::{Arc, Mutex};

use data::merge::merge;
use serde_json::{json, Map, Value};
use tokio::sync::broadcast::{self, Receiver, Sender};
use tokio_stream::{wrappers::ReceiverStream, StreamExt};
use tracing::error;

use crate::message::Message;

pub fn broadcast(mut stream: ReceiverStream<Message>) -> (Sender<Message>, Receiver<Message>) {
    let (tx, rx) = broadcast::channel::<Message>(32);

    let manage_tx = tx.clone();

    tokio::spawn(async move {
        while let Some(message) = stream.next().await {
            let _ = manage_tx.send(message);
        }
    });

    (tx, rx)
}

pub fn keep_state(mut reciver: Receiver<Message>) -> Arc<Mutex<Value>> {
    let state = Arc::new(Mutex::new(json!({})));

    let manage_state = state.clone();

    tokio::spawn(async move {
        while let Ok(message) = reciver.recv().await {
            match message {
                Message::Updates(updates) => {
                    let Ok(mut state) = manage_state.lock() else {
                        error!("failed to lock state");
                        continue;
                    };

                    for (topic, update) in updates {
                        let mut map = Map::new();
                        map.insert(topic, update);
                        merge(&mut state, Value::Object(map));
                    }
                }
                Message::Initial(initial) => {
                    let Ok(mut state) = manage_state.lock() else {
                        error!("failed to lock state");
                        continue;
                    };

                    *state = initial;
                }
            }
        }
    });

    state
}
