use std::{convert::Infallible, mem, sync::Arc, time::Duration};

use axum::{
    extract::State,
    response::{sse, Sse},
};
use futures::Stream;
use tokio_stream::{wrappers::BroadcastStream, StreamExt};
use tracing::{debug, info};

use crate::data::compression;

use super::AppState;

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

pub async fn sse_handler(
    State(state): State<Arc<AppState>>,
) -> Sse<impl Stream<Item = Result<sse::Event, Infallible>>> {
    let rx = state.tx.subscribe();

    debug!("new sse connection");
    info!("connections: {}", state.tx.receiver_count());

    let initial_stream = futures::stream::once(async {
        let initial_state = state.state.lock().unwrap().to_string();
        mem::drop(state);
        let initial = compression::deflate(initial_state).unwrap();

        debug!("streaming current");

        Ok(sse::Event::default().event("initial").data(initial))
    });

    let updates_stream = BroadcastStream::new(rx)
        .filter_map(|msg| msg.ok())
        .map(|msg| sse::Event::default().event(msg.name()).data(msg.inner()))
        .map(Ok);

    let stream = initial_stream.chain(updates_stream);

    let keep_alive = sse::KeepAlive::new()
        .interval(Duration::from_secs(10))
        .text("keep-alive-text");

    Sse::new(stream).keep_alive(keep_alive)
}
