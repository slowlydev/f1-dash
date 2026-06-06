use anyhow::Error;
use serde_json::json;
use tokio::sync::broadcast::Sender;
use tokio_stream::StreamExt;
use tracing::{error, trace, warn};

use crate::services::state_service::StateService;

const URL: &str = "livetiming.formula1.com/signalrcore";
const HUB: &str = "Streaming";

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

    while let Some(items) = stream.next().await {
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
