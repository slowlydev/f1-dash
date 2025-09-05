use std::time::Duration;

use tokio::{
    sync::mpsc,
    time::{sleep, timeout},
};
use tokio_stream::{wrappers::ReceiverStream, StreamExt};
use tracing::error;

use crate::{init, message::Message, parse_stream};

pub fn manage() -> ReceiverStream<Message> {
    let (tx, rx) = mpsc::channel::<Message>(32);

    tokio::spawn(async move {
        'manage: loop {
            sleep(Duration::from_secs(3)).await;

            let stream = match init().await {
                Ok(stream) => stream,
                Err(err) => {
                    error!(?err, "error occored starting the client, restarting");
                    continue 'manage;
                }
            };

            let mut parsed_stream = parse_stream(stream).await;

            loop {
                let res = timeout(Duration::from_secs(30), parsed_stream.next()).await;

                match res {
                    Ok(Some(message)) => {
                        if check_restart(&message) {
                            continue 'manage;
                        }
                        let _ = tx.send(message).await;
                    }
                    Ok(None) => {
                        error!("stream ended unexpectedly, restarting client");
                        continue 'manage;
                    }
                    Err(err) => {
                        error!(
                            ?err,
                            "timeout while waiting for next message, restarting client"
                        );
                        continue 'manage;
                    }
                }
            }
        }
    });

    ReceiverStream::new(rx)
}

fn check_restart(message: &Message) -> bool {
    match message {
        Message::Updates(updates) => {
            for (cat, update) in updates {
                if cat == "sessionInfo" && update.pointer("/name").is_some() {
                    return true;
                }
            }

            false
        }
        Message::Initial(_) => false,
    }
}
