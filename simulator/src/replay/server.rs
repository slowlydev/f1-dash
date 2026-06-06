use std::{env, sync::Arc};

use anyhow::Error;
use axum::{
    Router,
    extract::{
        State, WebSocketUpgrade,
        ws::{Message, WebSocket},
    },
    response::Response,
    routing::get,
};
use futures::{SinkExt, StreamExt};
use tokio::net::TcpListener;
use tracing::{debug, error, info};

pub struct AppState {
    lines: Vec<String>,
}

pub async fn run(lines: Vec<String>) -> Result<(), Error> {
    let addr = env::var("ADDRESS")?;

    let app_state = Arc::new(AppState { lines });

    let app = Router::new()
        .route("/ws", get(handle_http))
        .with_state(app_state);

    info!(addr, "starting simulator replay server");

    axum::serve(TcpListener::bind(addr).await?, app).await?;

    Ok(())
}

async fn handle_http(ws: WebSocketUpgrade, State(state): State<Arc<AppState>>) -> Response {
    info!("recived connection");

    ws.on_upgrade(|socket| handle_ws(socket, state))
}

async fn handle_ws(socket: WebSocket, state: Arc<AppState>) {
    let (mut tx, mut rx) = socket.split();

    tokio::select! {
        _ = async {
            let amount_of_updates = state.lines.len();

            debug!(amount_of_updates, "starting to send updates");

            for update in state.lines.iter() {
                match tx.send(Message::text(update)).await {
                    Ok(_) => {}
                    Err(e) => {
                        error!("error sending ws message: {}", e);
                        break;
                    }
                }
                tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
            }

            tx.send(Message::Close(None))
        } => {}
        _ = async {
            while let Some(Ok(msg)) = rx.next().await {
                match msg {
                    Message::Close(_) => {
                        info!("received close");
                        break;
                    }
                    _ => {}
                }
            }
        } => {}
    }

    info!("connection closed");
}
