use scylla::{transport::errors::NewSessionError, Session, SessionBuilder};

pub async fn connect() -> Result<Session, NewSessionError> {
    let uri = std::env::var("SCYLLA_URI").unwrap_or_else(|_| "127.0.0.1:9042".to_string());
    SessionBuilder::new().known_node(uri).build().await
}
