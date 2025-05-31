use std::sync::Arc;

use axum::{
    extract::{
        ws::{Message, WebSocket},
        State, WebSocketUpgrade,
    },
    response::Response,
    routing::get,
    Router,
};

use futures::{SinkExt, StreamExt};
use tokio::sync::{broadcast, mpsc};
use tracing::{error, info};

pub struct AppState {
    tx: broadcast::Sender<String>,
    mpsc_tx: mpsc::Sender<()>,
}

fn addr() -> String {
    std::env::var("SIMULATOR_ADDRESS").unwrap_or("0.0.0.0:8000".to_string())
}

pub async fn init(tx: broadcast::Sender<String>, mpsc_tx: mpsc::Sender<()>) {
    let app_state = Arc::new(AppState { tx, mpsc_tx });

    let app = Router::new()
        .route("/ws", get(handle_http))
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind(addr())
        .await
        .expect("failed to bind to port");

    info!("serving ws simulator on {}", addr());

    axum::serve(listener, app)
        .await
        .expect("failed to server http server");
}

async fn handle_http(ws: WebSocketUpgrade, State(state): State<Arc<AppState>>) -> Response {
    ws.on_upgrade(|socket| handle_ws(socket, state))
}

async fn handle_ws(socket: WebSocket, state: Arc<AppState>) {
    let mut reader_rx = state.tx.subscribe();

    state.mpsc_tx.clone().send(()).await.unwrap();

    info!("client connected to ws simulator");

    let (mut tx, mut rx) = socket.split();

    tokio::select! {
        _ = async {
            while let Ok(msg) = reader_rx.recv().await {
                match tx.send(Message::text(msg)).await {
                    Ok(_) => {}
                    Err(_) => error!("failed to send message"),
                }
            }
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

    info!("client disconnected from ws simulator");
}
