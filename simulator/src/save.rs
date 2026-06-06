use std::{
    fs::File,
    io::{LineWriter, Write},
    path::Path,
};

use anyhow::Error;
use tokio_stream::StreamExt;
use tracing::{debug, info};

const URL: &str = "livetiming.formula1.com";
const HUB: &str = "signalrcore";

const TOPICS: [&str; 17] = [
    "Heartbeat",
    "CarData.z",
    "Position.z",
    "ExtrapolatedClock",
    "TimingStats",
    "TimingAppData",
    "WeatherData",
    "TrackStatus",
    "SessionStatus",
    "DriverList",
    "RaceControlMessages",
    "SessionInfo",
    "SessionData",
    "LapCount",
    "TimingData",
    "TeamRadio",
    "ChampionshipPrediction",
];

pub async fn save(path: &Path) -> Result<(), Error> {
    if path.exists() {
        return Err(anyhow::anyhow!(
            "File already exists at path {}",
            path.display()
        ));
    }

    let file = match File::create(path) {
        Ok(file) => file,
        Err(e) => {
            return Err(anyhow::anyhow!(
                "Failed to create file at path {}: {}",
                path.display(),
                e
            ));
        }
    };

    let mut writer = LineWriter::new(file);

    info!("Connecting to F1 SignalR...");

    let mut signalr_client = signalr::create_client(URL, HUB).await?;

    info!("Subscribing to topics...");

    let initial = signalr::subscribe(&mut signalr_client, &TOPICS).await?;

    // Save the initial state as the first line (as JSON)
    let initial_json = serde_json::to_string(&initial)?;
    writeln!(writer, "{}", initial_json)?;
    debug!("Saved initial state");

    info!("Listening for updates... Press Ctrl+C to stop.");

    let mut stream = signalr::listen_raw(signalr_client);
    let mut count: u64 = 0;

    while let Some(raw_message) = stream.next().await {
        // Write the raw message as-is (it's already JSON from the WebSocket)
        writeln!(writer, "{}", raw_message)?;
        count += 1;

        if count % 100 == 0 {
            debug!(count, "Saved messages");
        }
    }

    writer.flush()?;
    info!(count, "Finished saving messages");

    Ok(())
}
