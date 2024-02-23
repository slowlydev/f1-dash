use tracing::{info, warn};

pub fn init() {
    tracing_subscriber::fmt().with_max_level(get_level()).init();
}

pub fn get_level() -> tracing::Level {
    let level = std::env::var("LOG_LEVEL");

    match level {
        Ok(level_string) => match level_string.as_str() {
            "error" => tracing::Level::ERROR,
            "warn" => tracing::Level::WARN,
            "info" => tracing::Level::INFO,
            "debug" => tracing::Level::DEBUG,
            "trace" => tracing::Level::TRACE,
            _ => {
                warn!(
                    "detected LOG_LEVEL env but no valid level has been set, using default: info"
                );
                tracing::Level::INFO
            }
        },
        Err(_) => {
            info!("no log level set using default: info");
            tracing::Level::INFO
        }
    }
}
