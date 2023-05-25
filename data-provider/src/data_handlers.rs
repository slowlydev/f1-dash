use std::sync::Arc;

use rocket::response::stream::Event;
use scylla::{IntoTypedRows, Session};

use crate::models::{RaceControlMessage, WeatherData};

pub async fn get_weather_data(database: &Arc<Session>) -> Result<Event, ()> {
    let query = database
        .query("SELECT * FROM f1_dash.weather", ())
        .await
        .unwrap();

    let entity = query
        .rows()
        .unwrap()
        .into_typed::<WeatherData>()
        .last()
        .unwrap()
        .unwrap();

    Ok(Event::json(&entity))
}

pub async fn get_race_control_messages(database: &Arc<Session>) -> Result<Event, ()> {
    let query = database
        .query("SELECT * FROM f1_dash.race_control_messages", ())
        .await
        .unwrap();

    let entity: Vec<RaceControlMessage> = query
        .rows()
        .unwrap()
        .into_typed::<RaceControlMessage>()
        .into_iter()
        .filter_map(|x| x.ok())
        .collect();

    Ok(Event::json(&entity))
}
