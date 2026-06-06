use std::{convert::Infallible, sync::Arc};

use tokio_stream::wrappers::BroadcastStream;

use axum::{
    extract::State,
    response::{
        Sse,
        sse::{Event, KeepAlive},
    },
};
use futures::{Stream, StreamExt, stream};
use tracing::{debug, error, info};

use crate::http_server::Context;

pub async fn sse_stream(
    State(ctx): State<Arc<Context>>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    debug!("sse stream starting");

    let initial_state = ctx
        .state_service
        .get_state_string()
        .await
        .unwrap_or_else(|e| {
            error!(?e, "failed to get initial state");
            "{}".to_string()
        });

    let connections = ctx.tx.receiver_count();
    let rx = ctx.tx.subscribe();

    info!(?connections, "connection stats");

    let initial = stream::once(async {
        debug!("streaming current initial");
        Ok(Event::default().event("initial").data(initial_state))
    });

    let updates = BroadcastStream::new(rx)
        .filter_map(|result| async move {
            match result {
                Ok(msg) => Some(msg),
                Err(e) => {
                    error!(?e, "broadcast stream error");
                    None
                }
            }
        })
        .map(|data| Event::default().event("update").data(data))
        .map(Ok);

    let stream = initial.chain(updates);
    let keep_alive = KeepAlive::new().text("keep-alive-text");

    Sse::new(stream).keep_alive(keep_alive)
}
