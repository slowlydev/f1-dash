use serde_json::Value;

use crate::{
    f1_models::SocketData,
    utils::{merge_object, parse_compressed},
    AppState,
};

pub fn update_state(data: String, state: AppState) {
    match serde_json::from_str::<SocketData>(&data) {
        Ok(parsed) => {
            if let Some(messages) = parsed.M {
                for message in messages {
                    if message.M == "feed" {
                        let [cat, msg] = &message.A[..] else {
                            println!("Failed to get cat, msg, time");
                            return;
                        };

                        let Some(parsed_cat) = cat.as_str() else {
                            println!("Failed to parse category");
                            return;
                        };

                        let mut cloned_msg: Value = msg.clone();

                        if parsed_cat == "CarData.z" {
                            // TODO remove unwrap()
                            cloned_msg = parse_compressed(msg.as_str().unwrap());
                        }

                        if parsed_cat == "Position.z" {
                            // TODO remove unwrap()
                            cloned_msg = parse_compressed(msg.as_str().unwrap());
                        }

                        println!("{cloned_msg:?}");

                        let mut current_state = state.lock().unwrap();
                    }
                }
            }

            if let Some(mut replay) = parsed.R {
                if replay["CarData.z"].is_string() {
                    // TODO remove unwrap()
                    replay["CarData"] = parse_compressed(replay["CarData.z"].as_str().unwrap());
                }

                if replay["Position.z"].is_string() {
                    // TODO remove unwrap()
                    replay["Position"] = parse_compressed(replay["Position.z"].as_str().unwrap());
                }

                println!("{replay:?}");

                let mut current_state = state.lock().unwrap();
            }
        }
        Err(e) => println!("Error {:?}", e),
    }
}
