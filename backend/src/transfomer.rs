use serde_json::{Map, Value};

pub fn pascal_to_camel(value: Value) -> Value {
    match value {
        Value::Object(obj) => {
            let camel_obj: Map<String, Value> = obj
                .into_iter()
                .map(|(pascal_key, value)| {
                    let camel_key = convert_key(&pascal_key);
                    let camel_value = pascal_to_camel(value);
                    (camel_key, camel_value)
                })
                .collect();
            Value::Object(camel_obj)
        }
        Value::Array(arr) => {
            Value::Array(arr.into_iter().map(|item| pascal_to_camel(item)).collect())
        }
        _ => value,
    }
}

fn convert_key(pascal_key: &str) -> String {
    // Convert PascalCase to camelCase
    let mut camel_chars = pascal_key.chars();
    if let Some(first_char) = camel_chars.next() {
        let camel_key = first_char.to_lowercase().collect::<String>() + camel_chars.as_str();
        camel_key
    } else {
        pascal_key.to_string()
    }
}
