use std::{mem, thread, time::Duration};

use futures::{pin_mut, Stream};
use tokio::{sync::broadcast::Sender, time::sleep};
use tokio_stream::StreamExt;
use tracing::{debug, error, info, trace};

use crate::{LiveEvent, LiveState};

use client;
use data::{compression, merge::merge, transformer};

pub fn manage(tx: Sender<LiveEvent>, state: LiveState) {
    // TODO start and stop on connect and disconnect

    thread::spawn(|| {
        let rt = tokio::runtime::Runtime::new().unwrap();

        rt.block_on(async {
            keep_client_alive(tx, state).await;
        })
    });
}

async fn keep_client_alive(tx: Sender<LiveEvent>, state: LiveState) {
    loop {
        if tx.receiver_count() < 2 {
            debug!("no connections yet");
            sleep(Duration::from_secs(5)).await;
            continue;
        }

        info!("starting client...");

        let stream = client::init().await;

        let stream = match stream {
            Ok(stream) => stream,
            Err(e) => {
                error!("client setup failed, restarting in 5 seconds {}", e);
                sleep(Duration::from_secs(5)).await;
                continue;
            }
        };

        let parsed_stream = client::parse_stream(stream).await;

        handle_stream(parsed_stream, tx.clone(), state.clone()).await;
    }
}

async fn handle_stream(
    stream: impl Stream<Item = client::message::Message>,
    tx: Sender<LiveEvent>,
    state: LiveState,
) {
    pin_mut!(stream);

    while let Some(message) = stream.next().await {
        match message {
            client::message::Message::Updates(mut updates) => {
                trace!("recived update");

                let mut state = state.lock().unwrap();

                for update in updates.iter_mut() {
                    let update = transformer::transform_map(update);

                    if let Some(new_session_name) = update.pointer("/sessionInfo/name") {
                        let current_session_name = state
                            .pointer("/sessionInfo/name")
                            .expect("we always should have a session name");

                        if new_session_name != current_session_name {
                            info!("session name changed, restarting client");
                            return;
                        }
                    }

                    let Some(update_compressed) = compression::deflate(update.to_string()) else {
                        error!("failed compressing update");
                        continue;
                    };

                    trace!("update compressed='{}'", update_compressed);

                    match tx.send(LiveEvent::Update(update_compressed)) {
                        Ok(_) => trace!("update sent"),
                        Err(e) => error!("failed sending update: {}", e),
                    };

                    merge(&mut state, update)
                }

                mem::drop(state);
            }
            client::message::Message::Initial(mut initial) => {
                trace!("recived initial");

                transformer::transform(&mut initial);

                let mut state = state.lock().unwrap();
                *state = initial.clone();
                mem::drop(state);

                let Some(initial) = compression::deflate(initial.to_string()) else {
                    error!("failed compressing update");
                    continue;
                };

                trace!("initial compressed='{}'", initial);

                match tx.send(LiveEvent::Initial(initial)) {
                    Ok(_) => trace!("initial sent"),
                    Err(e) => error!("failed sending initial: {}", e),
                };
            }
        }
    }
}
