use std::{collections::HashMap, mem};

use serde_json::{Map, Value};

use crate::client::parser::Update;

fn to_camel_case(string: &str) -> String {
    heck::AsLowerCamelCase(string).to_string()
}

pub fn transform(value: &mut Value) {
    match value {
        Value::Object(object) => {
            let mut camel_case_map = Map::new();

            for (key, value) in object.iter_mut() {
                if key == "_kf" {
                    continue;
                }

                transform(value);
                let new_key = to_camel_case(&key);
                camel_case_map.insert(new_key, mem::take(value));
            }

            *value = Value::Object(camel_case_map);
        }
        Value::Array(array) => {
            for value in array.iter_mut() {
                transform(value);
            }
        }
        _ => {}
    }
}

pub fn transform_map(map: &mut HashMap<String, Value>) -> Value {
    let mut camel_case_map = Map::new();

    for (key, value) in map.iter_mut() {
        transform(value);
        let new_key = to_camel_case(&key);
        camel_case_map.insert(new_key, mem::take(value));
    }

    Value::Object(camel_case_map)
}

pub fn transform_updates(map: &mut HashMap<String, Update>) {
    for (_, update) in map.iter_mut() {
        transform(&mut update.state);
        update.category = to_camel_case(&update.category);
    }
}
