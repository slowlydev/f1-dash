use anyhow::Error;
use serde_json::json;
use tokio::{sync::broadcast::Sender, time::Duration};
use tokio_stream::StreamExt;
use tracing::{error, info, trace, warn};

use crate::services::state_service::StateService;

const URL: &str = "livetiming.formula1.com/signalrcore";
const HUB: &str = "Streaming";

/// If no feed update arrives within this window the connection is considered
/// idle or dead (e.g. the session ended or the socket silently dropped) and we
/// return so the caller reconnects and picks up the next session.
const IDLE_TIMEOUT: Duration = Duration::from_secs(90);

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

pub async fn ingest_f1(
    state_service: StateService,
    update_sender: Sender<String>,
) -> Result<(), Error> {
    let mut client = signalr::create_client(URL, HUB).await?;

    let initial = signalr::subscribe(&mut client, &TOPICS).await?;
    state_service.set_state(initial).await?;

    let mut stream = signalr::listen(client);

    loop {
        let items = match tokio::time::timeout(IDLE_TIMEOUT, stream.next()).await {
            Ok(Some(items)) => items,
            Ok(None) => break,
            Err(_) => {
                info!(timeout = ?IDLE_TIMEOUT, "no updates received, reconnecting...");
                return Ok(());
            }
        };

        for update in items {
            trace!(?update.topic, "received update");

            if update.topic == "SessionInfo" && update.data.pointer("/Name").is_some() {
                warn!("received SessionInfo event, restarting...");
                return Ok(());
            }

            let payload = json!({ update.topic: update.data });

            if let Err(err) = update_sender.send(payload.to_string()) {
                error!(?err, "failed to send update");
            }

            if let Err(err) = state_service.update_state(payload).await {
                error!(?err, "failed to update state");
            }
        }
    }

    Ok(())
}
