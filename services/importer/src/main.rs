use anyhow::Error;
use dotenvy::dotenv;
use serde_json::Value;
use sqlx::PgPool;
use tracing::{info, trace};
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

use client::message::Message;

use timescale::{
    app_timing::{insert_tire_driver, TireDriver},
    init_timescaledb,
    timing::{insert_timing_driver, TimingDriver},
};

use models::State;
use parsers::{parse_timing_driver, parse_tire_driver};

mod models;
mod parsers;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let _ = dotenv();

    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::from_default_env())
        .init();

    info!("starting importer service");

    let pool = init_timescaledb(true).await?;

    let stream = client::manage();
    let (tx, rx) = client::broadcast(stream);
    let state = client::keep_state(rx);

    let mut message_rx = tx.subscribe();

    while let Ok(message) = message_rx.recv().await {
        match message {
            Message::Updates(updates) => {
                trace!(?updates, "recived updates, saving");

                let currnet_state = state.lock().unwrap().clone();

                let _ = parse_update(&pool, currnet_state, updates).await;
            }
            Message::Initial(initial) => {
                trace!(?initial, "recived initial, saving");

                let _ = save_initial_state(&pool, initial).await;
            }
        }
    }

    Ok(())
}

async fn parse_update(
    pool: &PgPool,
    state: Value,
    updates: Vec<(String, Value)>,
) -> Result<(), Error> {
    // check for TIMING_TOPICS
    // check for every driver that has a update and fill the rest

    let state = serde_json::from_value::<State>(state)?;

    for (topic, update) in updates {
        match &topic[..] {
            "timingData" => {
                let Some(drivers) = parse_timing_update(&state, update).await else {
                    continue;
                };

                for driver in drivers {
                    let _ = insert_timing_driver(pool, driver).await;
                }
            }
            "timingAppData" => {
                let Some(drivers) = parse_tire_update(&state, update).await else {
                    continue;
                };

                for driver in drivers {
                    let _ = insert_tire_driver(pool, driver).await;
                }
            }
            _ => {}
        }
    }

    Ok(())
}

async fn parse_timing_update(state: &State, update: Value) -> Option<Vec<TimingDriver>> {
    // for every driver in the update parse driver and use state for None values
    let timing_data = state.timing_data.as_ref()?;
    let lap = state.lap_count.as_ref()?.current_lap;

    let mut drivers = vec![];

    for (nr, update_driver) in update["lines"].as_object()?.into_iter() {
        let Some(driver) = timing_data.lines.get(nr) else {
            continue;
        };

        let Some(driver) = parse_timing_driver(nr, Some(lap), driver, Some(update_driver)) else {
            continue;
        };

        drivers.push(driver);
    }

    Some(drivers)
}

async fn parse_tire_update(state: &State, update: Value) -> Option<Vec<TireDriver>> {
    let timing_app_data = state.timing_app_data.as_ref()?;
    let lap = state.lap_count.as_ref()?.current_lap;

    let mut drivers = vec![];

    for (nr, update_driver) in update["lines"].as_object()?.into_iter() {
        let Some(driver) = timing_app_data.lines.get(nr) else {
            continue;
        };

        let Some(driver) = parse_tire_driver(nr, Some(lap), driver, Some(update_driver)) else {
            continue;
        };

        drivers.push(driver);
    }

    Some(drivers)
}

async fn save_initial_state(pool: &PgPool, state: Value) -> Result<(), Error> {
    let state = serde_json::from_value::<State>(state)?;

    let lap = state.lap_count.and_then(|v| Some(v.current_lap));

    if let Some(timing_data) = state.timing_data {
        for (nr, driver) in timing_data.lines.iter() {
            let Some(timing_driver) = parse_timing_driver(&nr, lap, &driver, None) else {
                continue;
            };

            let _ = insert_timing_driver(pool, timing_driver).await;
        }
    }

    if let Some(app_timing_data) = state.timing_app_data {
        for (nr, driver) in app_timing_data.lines.iter() {
            let Some(tire_driver) = parse_tire_driver(&nr, lap, &driver, None) else {
                continue;
            };

            let _ = insert_tire_driver(pool, tire_driver).await;
        }
    }

    Ok(())
}
