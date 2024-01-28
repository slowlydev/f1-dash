use futures::StreamExt;
use serde::{Deserialize, Serialize};

use std::net::SocketAddr;
use tokio::{net::TcpStream, sync::mpsc::UnboundedSender};

use tokio_tungstenite::{tungstenite::Message, WebSocketStream};
use tracing::{debug, info};

use crate::{
    broadcasting::{self, BroadcastEvents},
    server,
};

pub async fn listen(
    stream: WebSocketStream<TcpStream>,
    addr: SocketAddr,
    id: u32,
    broadcast_sender: UnboundedSender<BroadcastEvents>,
) {
    let (sender, mut reciver) = stream.split();
    let conn = broadcasting::Connection::new(id, addr, sender);
    let _ = broadcast_sender.send(BroadcastEvents::Join(conn));

    while let Some(Ok(msg)) = reciver.next().await {
        match msg {
            Message::Text(msg) => {
                let Ok(message) = serde_json::from_str::<server::DelayMessage>(&msg) else {
                    return;
                };

                debug!("valid message, value: {}", message.delay);

                if message.delay > 0 {
                    info!("requesting delay");
                    // request delay
                    // let _ = delay_req_tx.send(message.delay);
                } else {
                    info!("resetting delay");
                    //
                };
            }
            Message::Close(_) => {
                debug!("got close frame, aborting");
                break;
            }
            _ => {}
        }
    }

    broadcast_sender.send(BroadcastEvents::Quit(id)).unwrap();

    debug!("we are gonna disconnect, hopefully");
}

#[derive(Serialize, Deserialize)]
pub struct DelayMessage {
    pub delay: i64,
}
