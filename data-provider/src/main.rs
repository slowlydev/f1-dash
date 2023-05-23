use std::{sync::Arc, time::Duration};

use cors::CORS;
use rocket::{
    async_stream::{self},
    response::stream::{Event, EventStream},
    tokio::time::sleep,
    State,
};

mod cors;
mod models;
mod scylladb;
use scylla::{IntoTypedRows, Session};
use scylladb::ScyllaDB;

use crate::models::WeatherData;

#[macro_use]
extern crate rocket;

#[get("/weather")]
fn weather_stream(database: &State<ScyllaDB>) -> EventStream![] {
    let session: Arc<Session> = database.session.clone();

    let stream = async_stream::stream! {
        loop {
            if let Ok(event) = get_weather_data(&session).await {
                yield event;
                println!("Send Weather");
            }

            sleep(Duration::from_millis(100)).await;
        }
    };

    EventStream::from(stream)
}

#[launch]
async fn rocket() -> _ {
    let database = ScyllaDB::new().await.unwrap();

    rocket::build()
        .manage(database)
        .mount("/", routes![weather_stream])
        .attach(CORS)
}

async fn get_weather_data(database: &Arc<Session>) -> Result<Event, ()> {
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
