use scylla::Session;
use serde_json::{Map, Value};

use crate::{
    models::{RaceControlMessage, WeatherData},
    SocketData,
};

fn extract_message(socket_data: &SocketData) -> Option<&Vec<Value>> {
    if let Some(message) = &socket_data.M {
        if let Some(payloads) = message.iter().next() {
            return Some(&payloads.A);
        }
    }
    None
}

pub async fn handle(socket_data: SocketData, session: &Session) {
    println!("Raw: {:?}", socket_data.M);

    let Some(full_message) = extract_message(&socket_data) else {
        println!("Failed to extract message");
        return;
    };

    let Some(key) = &full_message.get(0) else {
        println!("Failed to get key");
        return;
    };

    let Some(message) = &full_message.get(1) else {
        println!("Failed to get message");
        return;
    };

    let Some(time) = &full_message.get(2) else {
        println!("Failed to get time");
        return;
    };

    println!("Key: {:?} Message: {:?}", key, message);

    let temp = Map::new();

    let better_key = key.as_str().unwrap_or("");
    let better_message = key.as_object().unwrap_or(&temp);
    let better_time = time.as_str().unwrap_or("");

    match &better_key[..] {
        // "TimingData" => extract_timing_data(message, datetime),
        "RaceControlMessages" => {
            handle_race_control_messages(Value::Object(better_message.clone()), &session).await
        }
        "WeatherData" => {
            handle_weather_data(
                Value::Object(better_message.clone()),
                better_time.to_owned(),
                &session,
            )
            .await
        }
        _ => {
            println!("Failed to handle event");
        }
    };
}

async fn handle_weather_data(message: Value, time: String, session: &Session) {
    let weather_data = WeatherData {
        humidity: message["Humidity"].as_f64().unwrap_or(0.0),
        pressure: message["Pressure"].as_f64().unwrap_or(0.0),
        rainfall: message["Rainfall"].as_f64().unwrap_or(0.0),
        wind_speed: message["WindSpeed"].as_f64().unwrap_or(0.0),
        wind_direction: message["WindDirection"].as_f64().unwrap_or(0.0),
        air_temp: message["AirTemp"].as_f64().unwrap_or(0.0),
        track_temp: message["TrackTemp"].as_f64().unwrap_or(0.0),
        time,
    };

    println!("{:?}", weather_data);

    session.query("INSERT INTO weather (humidity, pressure, rainfall, wind_direction, wind_speed, air_temp, track_temp, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", weather_data).await.err();
}

async fn handle_race_control_messages(message: Value, session: &Session) {
    let Some(rc_messages_obj) = message["Messages"].as_object() else {
        println!("Failed to get rcm object");
        return;
    };

    let Some(rc_messages_values) = rc_messages_obj.values().next() else {
        println!("Failed to get rcm values");
        return;
    };

    let Some(rcm) = rc_messages_values["Message"].as_str() else {
        println!("Failed to get rc message");
        return;
    };
    let Some(time) = rc_messages_values["Utc"].as_str() else {
        println!("Failed to get rc time");
        return;
    };

    let race_control_message = RaceControlMessage {
        message: rcm.to_string(),
        time: time.to_string(),
    };

    session
        .query(
            "INSERT INTO race_control_messages (message, time) VALUES (?, ?)",
            race_control_message,
        )
        .await
        .err();
}
