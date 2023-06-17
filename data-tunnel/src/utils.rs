// pub fn fix_json(line: &str) -> String {
//     let fixed_line = line
//         .replace("'", "\"")
//         .replace("True", "true")
//         .replace("False", "false");
//     fixed_line
// }

use base64::{
    engine::{general_purpose, GeneralPurpose},
    Engine,
};
use serde_json::{from_value, Value};
use zune_inflate::DeflateDecoder;

pub fn encode_uri_component(s: &str) -> String {
    let mut encoded = String::new();
    for c in s.chars() {
        match c {
            '-' | '_' | '.' | '!' | '~' | '*' | '\'' | '(' | ')' => {
                encoded.push(c);
            }
            '0'..='9' | 'a'..='z' | 'A'..='Z' => {
                encoded.push(c);
            }
            _ => {
                for b in c.to_string().as_bytes() {
                    encoded.push_str(format!("%{:X}", b).as_str());
                }
            }
        }
    }
    encoded
}

// TODO remove expect()
pub fn parse_compressed(data: &str) -> Value {
    let engine: GeneralPurpose = general_purpose::STANDARD;
    let decoded_base64 = engine.decode(data).expect("Failed to decode");
    let mut decoder = DeflateDecoder::new(&decoded_base64);
    let decompressed_data = decoder.decode_deflate().expect("Failed to decompress");
    let converted = std::str::from_utf8(&decompressed_data).expect("Failed to convert");
    serde_json::from_str::<Value>(converted).expect("Failed to parse JSON")
}

pub fn merge_object(original: Value, modifier: Option<Value>) -> Value {
    let Some(modifier) = modifier else {
        return original;
    };

    let mut original_copy = from_value::<Value>(modifier).unwrap();

    if let Value::Object(modifier) = modifier {
        for (newKey, newValue) in modifier.iter() {
            let is_object = newValue.is_object() || newValue.is_array() || !newValue.is_null();

            if is_object && newValue.as_object().unwrap().len() > 0 {
                let new_value = original_copy.clone()[newKey.clone()];

                original_copy[newKey] = merge_object(new_value, Some(newValue.clone()));
            } else {
                original_copy[newKey] = newValue.clone();
            }
        }
    }

    return original_copy;
}
