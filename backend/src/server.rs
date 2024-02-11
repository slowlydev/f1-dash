use futures::StreamExt;

use std::net::SocketAddr;
use tokio::{net::TcpStream, sync::mpsc::UnboundedSender};

use tokio_tungstenite::{tungstenite::Message, WebSocketStream};
use tracing::debug;

use crate::broadcasting::{self, BroadcastEvents};

pub async fn listen(
    stream: WebSocketStream<TcpStream>,
    addr: SocketAddr,
    id: u32,
    broadcast_sender: UnboundedSender<BroadcastEvents>,
) {
    let (sender, mut receiver) = stream.split();
    let conn = broadcasting::Connection::new(id, addr, sender);
    let _ = broadcast_sender.send(BroadcastEvents::Join(conn));

    while let Some(Ok(msg)) = receiver.next().await {
        match msg {
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
