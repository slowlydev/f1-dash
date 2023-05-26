use rocket::{
    async_stream::{self},
    response::stream::EventStream,
    tokio::time::sleep,
    State,
};
use scylla::Session;
use std::{sync::Arc, time::Duration};

mod cors;
use cors::CORS;

mod data_handlers;
use data_handlers::{get_race_control_messages, get_weather_data};

mod scylladb;
use scylladb::ScyllaDB;

mod models;

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

            sleep(Duration::from_secs(1)).await;
        }
    };

    EventStream::from(stream)
}

#[get("/rcm")]
fn rcm_stream(database: &State<ScyllaDB>) -> EventStream![] {
    let session: Arc<Session> = database.session.clone();

    let stream = async_stream::stream! {
        loop {
            if let Ok(event) = get_race_control_messages(&session).await {
                yield event;
                println!("Send Race Control Message");
            }

            sleep(Duration::from_secs(1)).await;
        }
    };

    EventStream::from(stream)
}

#[launch]
async fn rocket() -> _ {
    let database = ScyllaDB::new().await.unwrap();

    rocket::build()
        .manage(database)
        .mount("/", routes![weather_stream, rcm_stream])
        .attach(CORS)
}
