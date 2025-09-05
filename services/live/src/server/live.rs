use std::{convert::Infallible, sync::Arc};

use axum::{
    extract::State,
    response::{sse, Sse},
};
use client::message::Message;
use futures::Stream;
use tokio_stream::{wrappers::BroadcastStream, StreamExt};
use tracing::{debug, info};

use crate::AppState;

fn sse_event(message: Message) -> Option<sse::Event> {
    match message {
        Message::Updates(updates) => sse::Event::default()
            .event("updates")
            .json_data(updates)
            .ok(),
        Message::Initial(initial) => sse::Event::default()
            .event("initial")
            .json_data(initial)
            .ok(),
    }
}

pub async fn sse_handler(
    State(state): State<Arc<AppState>>,
) -> Sse<impl Stream<Item = Result<sse::Event, Infallible>>> {
    let rx = state.tx.subscribe();
    let connections = state.tx.receiver_count();

    info!(connections, "new sse connection");

    // Use RwLock for concurrent reads and avoid unnecessary clone
    let initial_state = {
        let state_guard = state.state.read().await;
        state_guard.clone()
    };

    let initial_stream = futures::stream::once(async {
        debug!("streaming current initial");
        Ok(sse::Event::default()
            .event("initial")
            .json_data(initial_state)
            .unwrap())
    });

    let updates_stream = BroadcastStream::new(rx)
        .filter_map(|msg| msg.ok())
        .filter_map(sse_event)
        .map(Ok);

    Sse::new(initial_stream.chain(updates_stream))
}
