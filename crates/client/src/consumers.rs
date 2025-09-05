use std::sync::Arc;
use tokio::sync::RwLock;

use data::merge::merge;
use serde_json::{json, Map, Value};
use tokio::sync::broadcast::{self, Receiver, Sender};
use tokio_stream::{wrappers::ReceiverStream, StreamExt};

use crate::message::Message;

pub fn broadcast(stream: ReceiverStream<Message>) -> (Sender<Message>, Receiver<Message>) {
    let (tx, rx) = broadcast::channel::<Message>(32);
    let tx_clone = tx.clone();

    tokio::spawn(async move {
        tokio::pin!(stream);
        while let Some(message) = stream.next().await {
            let _ = tx_clone.send(message);
        }
    });

    (tx, rx)
}

pub fn keep_state(mut reciver: Receiver<Message>) -> Arc<RwLock<Value>> {
    let state = Arc::new(RwLock::new(json!({})));

    let manage_state = state.clone();

    tokio::spawn(async move {
        while let Ok(message) = reciver.recv().await {
            match message {
                Message::Updates(updates) => {
                    let mut state = manage_state.write().await;

                    for (topic, update) in updates {
                        let mut map = Map::new();
                        map.insert(topic, update);
                        merge(&mut state, Value::Object(map));
                    }
                }
                Message::Initial(initial) => {
                    let mut state = manage_state.write().await;
                    *state = initial;
                }
            }
        }
    });

    state
}
