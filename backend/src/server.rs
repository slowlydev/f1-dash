use anyhow::Ok;
use tokio::net::TcpListener;
use tracing::debug;

pub struct Server {
    pub listener: TcpListener,
}

impl Server {
    pub async fn new() -> Result<Server, anyhow::Error> {
        let addr = "127.0.0.1:4000".to_string();

        debug!("creating new server on: {}", addr);

        let listener: TcpListener = TcpListener::bind(&addr).await.unwrap();
        let server = Server { listener };
        Ok(server)
    }
}
