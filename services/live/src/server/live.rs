use std::{convert::Infallible, mem, sync::Arc, time::Duration};

use axum::{
    extract::State,
    response::{sse, Sse},
};
use client::message::Message;
use futures::Stream;
use serde_json::{json, Map, Value};
use tokio_stream::{wrappers::BroadcastStream, StreamExt};
use tracing::{debug, info};

use data::merge::merge;

use crate::AppState;

// TODO clean this up a bit maybe
fn sse_event(message: Message) -> sse::Event {
    let (event, data): (&str, Value) = match message {
        Message::Updates(updates) => {
            let mut batched_update = json!({});

            for (topic, update) in updates {
                let mut map = Map::new();
                map.insert(topic, update);
                merge(&mut batched_update, Value::Object(map));
            }

            // TODO maybe send the updates in array instead of object

            ("update", batched_update)
        }
        Message::Initial(value) => ("initial", value),
    };

    sse::Event::default().event(event).json_data(data).unwrap()
}

pub async fn sse_handler(
    State(state): State<Arc<AppState>>,
) -> Sse<impl Stream<Item = Result<sse::Event, Infallible>>> {
    let rx = state.tx.subscribe();
    let connections = state.tx.receiver_count();

    info!(connections, "new sse connection");

    let initial_state_lock = state.state.lock().unwrap();
    let initial_state = initial_state_lock.clone();
    mem::drop(initial_state_lock);

    let initial_stream = futures::stream::once(async {
        debug!("streaming current initial");

        Ok(sse::Event::default()
            .event("initial")
            .json_data(initial_state)
            .unwrap())
    });

    let updates_stream = BroadcastStream::new(rx)
        .filter_map(|msg| msg.ok())
        .map(|message| sse_event(message))
        .map(Ok);

    let stream = initial_stream.chain(updates_stream);

    let keep_alive = sse::KeepAlive::new()
        .interval(Duration::from_secs(10))
        .text("keep-alive-text");

    Sse::new(stream).keep_alive(keep_alive)
}
