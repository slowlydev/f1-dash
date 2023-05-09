use scylla::Session;
use serde_json::{Map, Value};
use uuid::Uuid;

use crate::{
    live_timing_models::{Message, MessageData},
    models::{RaceControlMessage, WeatherData},
    utils::{parse_float, parse_int},
    SocketData,
};

fn extract_message_data(socket_data: &SocketData) -> Option<&Vec<Message>> {
    if let Some(message) = &socket_data.M {
        if let Some(payloads) = message.iter().next() {
            return Some(&payloads.A);
        }
    }
    None
}

fn extract_category(message_data: &[Message]) -> Option<String> {
    if let Some(MessageData::RaceControlMessage {
        Category: Some(category),
        ..
    }) = message_data.get(0)
    {
        Some(category.clone())
    } else {
        None
    }
}

fn extract_message(message_data: &[Message]) -> Option<&Message> {
    if let Some(message) = message_data.get(1) {
        match message {
            Message::TimingDataMessage { .. } => Some(message),
            Message::WeatherMessage { .. } => Some(message),
            Message::RaceControlMessage { .. } => Some(message),
            _ => None,
        }
    } else {
        None
    }
}

fn extract_time(message_data: &[Message]) -> Option<String> {
    if let Some(MessageData::RaceControlMessage { Utc: time, .. }) = message_data.get(2) {
        Some(time.clone())
    } else {
        None
    }
}

pub async fn handle(socket_data: SocketData, session: &Session) {
    // println!("Raw: {:?}", socket_data.M);

    let Some(message_data) = extract_message_data(&socket_data) else {
        println!("Failed to extract message data");
        return;
    };

    let Some(cat) = extract_category(message_data) else {
        println!("Failed to get category");
        return;
    };

    let Some(msg) = extract_message(message_data) else {
        println!("Failed to get message");
        return;
    };

    let Some(time) = extract_time(message_data) else {
        println!("Failed to get time");
        return;
    };

    println!("Cat: {:?}", cat);

    match &cat[..] {
        // "TimingData" => extract_timing_data(message, datetime),
        "RaceControlMessages" => handle_race_control_messages(msg, &session).await,
        "WeatherData" => handle_weather_data(&msg, time, session).await,
        _ => (),
    };
}

async fn handle_weather_data(message: &Message, time: String, session: &Session) {
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

async fn handle_race_control_messages(message: Message, session: &Session) {
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
    // handle_last_lap_time(lines);
}
