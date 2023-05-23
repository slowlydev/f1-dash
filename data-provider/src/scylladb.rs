use std::sync::Arc;

use scylla::{transport::errors::NewSessionError, Session, SessionBuilder};

pub struct ScyllaDB {
    pub session: Arc<Session>,
}

impl ScyllaDB {
    pub async fn new() -> Result<ScyllaDB, NewSessionError> {
        let uri = std::env::var("SCYLLA_URI").unwrap_or_else(|_| "127.0.0.1:9042".to_string());
        let session: Session = SessionBuilder::new().known_node(uri).build().await?;

        Ok(ScyllaDB {
            session: Arc::new(session),
        })
    }
}
