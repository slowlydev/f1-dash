use std::collections::HashMap;

use scylla::Session;
use serde_json::Value;
use uuid::Uuid;

use crate::{
    live_timing_models::{Driver, RaceControlMessages, TimingDataMessage, WeatherMessage},
    models::{LastLapTime, RaceControlMessage, WeatherData},
    utils::{parse_float, parse_int},
    SocketData,
};

// this returns the vec of the catergory, message, timestamp
fn extract_message_data(socket_data: &SocketData) -> Option<&Vec<Value>> {
    if let Some(message) = &socket_data.M {
        if let Some(payloads) = message.iter().next() {
            return Some(&payloads.A);
        }
    }
    None
}

pub async fn handle(socket_data: SocketData, session: &Session) {
    // println!("Raw: {:?}", socket_data.M);

    let Some(data) = extract_message_data(&socket_data) else {
      println!("Failed to extract message data");
			println!("MSG: {:?}", socket_data.M);
      return;
    };

    let [cat, msg, time] = &data[..] else {
			println!("Failed to get cat, msg, time");
			return;
		};

    let Some(parsed_cat) = cat.as_str() else {
			println!("Failed to parse category");
			return;
		};

    let Some(parsed_time) = time.as_str() else {
			println!("Failed to parse time");
			return;
		};

    match &parsed_cat[..] {
        "WeatherData" => handle_weather_data(msg, session, parsed_time).await,
        "RaceControlMessages" => handle_race_control_messages(msg, session).await,
        "TimingData" => handle_timing_data(msg, session, parsed_time).await,
        _ => (),
    };
}

async fn handle_weather_data(msg: &Value, session: &Session, time: &str) {
    let Ok(parsed_msg) = serde_json::from_value::<WeatherMessage>(msg.clone()) else {
    	println!("Failed to parse msg");
    	return;
    };

    let uuid = Uuid::new_v4();

    let weather_data = WeatherData {
        id: uuid,
        humidity: parse_float(&parsed_msg.Humidity, 0.0),
        pressure: parse_float(&parsed_msg.Pressure, 0.0),
        rainfall: parse_float(&parsed_msg.Rainfall, 0.0),
        wind_direction: parse_int(&parsed_msg.WindDirection, 0),
        wind_speed: parse_float(&parsed_msg.WindSpeed, 0.0),
        air_temp: parse_float(&parsed_msg.AirTemp, 0.0),
        track_temp: parse_float(&parsed_msg.TrackTemp, 0.0),
        time: time.to_string(),
    };

    println!("{:?}", weather_data);

    session
        .query(
            "INSERT INTO f1_dash.weather (id, humidity, pressure, rainfall, wind_direction, wind_speed, air_temp, track_temp, time) 
						VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            weather_data,
        )
        .await
        .expect("Failed to insert");
}

async fn handle_race_control_messages(msg: &Value, session: &Session) {
    let Ok(parsed_msg) = serde_json::from_value::<RaceControlMessages>(msg.clone()) else {
		println!("Failed to parse msg");
		return;
	};

    let Some(rc_msg) = parsed_msg.Messages.values().next() else {
			println!("Failed to get rc msg");
			return;
		};

    let uuid = Uuid::new_v4();

    let race_control_message = RaceControlMessage {
        id: uuid,
        message: rc_msg.Message.to_string(),
        time: rc_msg.Utc.to_string(),
    };

    println!("{:?}", race_control_message);

    session
        .query(
            "INSERT INTO f1_dash.race_control_messages (id, message, time) VALUES (?, ?, ?)",
            race_control_message,
        )
        .await
        .expect("Failed to insert");
}

async fn handle_timing_data(msg: &Value, session: &Session, time: &str) {
    let Ok(parsed_msg) = serde_json::from_value::<TimingDataMessage>(msg.clone()) else {
		println!("Failed to parse msg");
		return;
	};

    let lines: HashMap<String, Driver> = parsed_msg.Lines;

    // println!("{:?}", lines);

    // last lap time

    let prepared_lap_time_query = session
        .prepare("INSERT INTO f1_dash.last_lap_time (id, lap_time, personal_best, time) VALUES (?, ?, ?, ?)")
        .await
        .expect("Failed to prepare last lap query");

    for entity in handle_last_lap_time(lines, time) {
        println!("{:?}", entity);

        session
            .execute(&prepared_lap_time_query, entity)
            .await
            .expect("Failed to insert");
    }
}

fn handle_last_lap_time(lines: HashMap<String, Driver>, time: &str) -> Vec<LastLapTime> {
    let mut results: Vec<LastLapTime> = Vec::new();

    lines.iter().for_each(|(_driver_nr, driver)| {
        let uuid = Uuid::new_v4();

        let Some(lap_time) = &driver.LastLapTime else {
            return;
        };

        results.push(LastLapTime {
            id: uuid,
            lap_time: lap_time.Value.to_string(),
            personal_best: lap_time.PersonalFastest,
            time: time.to_string(),
        });
    });

    results
}
