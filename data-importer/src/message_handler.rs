use scylla::Session;
use serde_json::{Map, Value};
use uuid::Uuid;

use crate::{
    models::{RaceControlMessage, WeatherData},
    utils::{parse_float, parse_int},
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
    // println!("Raw: {:?}", socket_data.M);

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

    println!("Key: {:?}", key);

    let temp = Map::new();

    let better_key = key.as_str().unwrap_or("");
    let better_message = message.as_object().unwrap_or(&temp);
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
        "TimingData" => handle_timing_data(Value::Object(better_message.clone()), &session).await,
        _ => (),
    };
}

async fn handle_weather_data(message: Value, time: String, session: &Session) {
    let uuid = Uuid::new_v4();

    let humidity = parse_float(message["Humidity"].as_str(), 0.0);
    let pressure = parse_float(message["Pressure"].as_str(), 0.0);
    let rainfall = parse_float(message["Rainfall"].as_str(), 0.0);
    let wind_speed = parse_float(message["WindSpeed"].as_str(), 0.0);
    let wind_direction = parse_int(message["WindDirection"].as_str(), 0);
    let air_temp = parse_float(message["AirTemp"].as_str(), 0.0);
    let track_temp = parse_float(message["TrackTemp"].as_str(), 0.0);

    let weather_data = WeatherData {
        id: uuid,
        humidity,
        pressure,
        rainfall,
        wind_direction,
        wind_speed,
        air_temp,
        track_temp,
        time,
    };

    session
        .query(
            "INSERT INTO f1_dash.weather (
        id,
        humidity,
        pressure,
        rainfall,
        wind_direction,
        wind_speed,
        air_temp,
        track_temp,
        time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            weather_data,
        )
        .await
        .expect("Failed to insert");
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

    let uuid = Uuid::new_v4();

    let race_control_message = RaceControlMessage {
        id: uuid,
        message: rcm.to_string(),
        time: time.to_string(),
    };

    session
        .query(
            "INSERT INTO f1_dash.race_control_messages (id, message, time) VALUES (?, ?, ?)",
            race_control_message,
        )
        .await
        .expect("Failed to insert");
}

async fn handle_timing_data(message: Value, session: &Session) {
    let Some(lines) = message["Lines"].as_object() else {
        println!("Failed to get lines object");
        return;
    };

    println!("{:?}", lines);
}
