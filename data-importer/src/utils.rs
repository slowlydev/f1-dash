use chrono::{DateTime, Duration, Local};
use scylla::frame::value::Timestamp;

pub fn fix_json(line: &str) -> String {
    let fixed_line = line
        .replace("'", "\"")
        .replace("True", "true")
        .replace("False", "false");
    fixed_line
}

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

pub fn parse_float(input: &str, default: f64) -> f64 {
    match input.parse::<f64>() {
        Ok(parsed_val) => parsed_val,
        Err(_) => default,
    }
}

pub fn parse_int(input: &str, default: i16) -> i16 {
    match input.parse::<i16>() {
        Ok(parsed_val) => parsed_val,
        Err(_) => default,
    }
}

pub fn parse_gap(input: &str) -> f64 {
    let prepare: String = input.replace("+", "");
    let parts: Vec<&str> = prepare.split(".").collect();

    let Some(s) = parts.get(0) else {
        return 0.0;
    };

    let Some(ms) = parts.get(1) else {
        return 0.0;
    };

    parse_int(s, 0) as f64 + parse_int(ms, 0) as f64 / 1000.0
}

pub fn parse_timestamp(input: &str) -> Timestamp {
    let fixed_utc_string = if input.ends_with("Z") {
        input.to_string()
    } else {
        format!("{input}Z")
    };

    let date_time = DateTime::parse_from_rfc3339(&fixed_utc_string);

    let Ok(utc) = date_time else {
        let now: DateTime<Local> = Local::now();
        return Timestamp(Duration::milliseconds(now.timestamp_millis()));
    };

    Timestamp(Duration::milliseconds(utc.timestamp_millis()))
}
