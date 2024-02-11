use chrono::{DateTime, Utc};
use serde_json::Value;
use std::{collections::HashMap, string};
use tracing::debug;

pub mod merge;

use crate::parser::{self};

#[derive(Debug)]
pub struct History {
    pub initial: Option<Value>,
    pub updates: Vec<parser::Update>,
    pub realtime: Option<Realtime>,
}

impl History {
    pub fn new() -> History {
        History {
            initial: None,
            updates: Vec::new(),
            realtime: None,
        }
    }

    pub fn set_initial(&mut self, state: Value) {
        self.realtime = Some(Realtime {
            timestamp: None,
            state: state.clone(),
        });

        self.initial = Some(state);

        debug!("initial state set ",);
    }

    pub fn add_updates(&mut self, updates: &mut Vec<parser::Update>) {
        if updates.len() < 1 {
            return;
        };

        debug!("adding updates {}", updates.len());

        if let Some(ref mut realtime) = self.realtime {
            debug!("realtime is available");

            for update in updates.clone() {
                debug!("appling update to realtime");

                // realtime.timestamp = Some(update.timestamp);
                realtime.timestamp = Some(Utc::now());
                merge::merge(&mut realtime.state, &update.state);
            }
        }

        self.updates.append(updates);
    }

    pub fn get_realtime(&self) -> Option<Value> {
        debug!("getting realtime state");

        if let Some(realtime) = &self.realtime {
            let mut history = realtime.state.clone();

            if let Value::Object(ref mut state) = history {
                inject_history(state, self.updates.iter().collect());
            }

            return Some(history);
        }

        None
    }
}

fn inject_history(state: &mut serde_json::Map<String, Value>, updates: Vec<&parser::Update>) {
    let weather_updates: Vec<&Value> = updates
        .iter()
        .filter(|up| up.category == "WeatherData")
        .map(|up| &up.state)
        .collect();

    let timing_updates: Vec<&Value> = updates
        .iter()
        .filter(|up| up.category == "TimingData")
        .map(|up| &up.state)
        .collect();

    let history = value_history_computation(weather_updates, timing_updates);

    state.insert(
        "WeatherDataHistory".to_owned(),
        serde_json::to_value(history.0).unwrap(),
    );

    state.insert(
        "TimingDataGapHistory".to_owned(),
        serde_json::to_value(history.1).unwrap(),
    );

    state.insert(
        "TimingDataLaptimeHistory".to_owned(),
        serde_json::to_value(history.2).unwrap(),
    );

    state.insert(
        "TimingDataSectortimeHistory".to_owned(),
        serde_json::to_value(history.3).unwrap(),
    );
}

fn insert_hashmap_vec<T>(map: &mut HashMap<String, Vec<T>>, key: &str, value: T) {
    if let Some(existing_key) = map.get_mut(key) {
        existing_key.push(value);
    } else {
        map.insert(key.to_owned(), vec![value]);
    }
}

fn value_history_computation(
    weather_updates: Vec<&Value>,
    timing_updates: Vec<&Value>,
) -> (Value, Value, Value, Value) {
    let mut weather: HashMap<String, Vec<string::String>> = HashMap::new();
    let mut gaps: HashMap<String, Vec<string::String>> = HashMap::new();
    let mut laptimes: HashMap<String, Vec<string::String>> = HashMap::new();
    let mut sectortimes: HashMap<String, HashMap<String, Vec<string::String>>> = HashMap::new();

    for update in &weather_updates {
        if let Some(Value::Object(obj)) = update.pointer("/WeatherData") {
            for (k, v) in obj {
                if let Value::String(v) = v {
                    if !v.is_empty() {
                        insert_hashmap_vec(&mut weather, k, v.clone());
                    }
                }
            }
        }
    }

    for update in &timing_updates {
        if let Some(Value::Object(lines)) = update.pointer("/TimingData/Lines") {
            for (rn, v) in lines {
                // gaps
                if let Some(Value::String(gap)) = v.pointer("/IntervalToPositionAhead/Value") {
                    if !gap.is_empty() {
                        insert_hashmap_vec(&mut gaps, rn, gap.clone());
                    }
                }

                // laptimes
                if let Some(Value::String(laptime)) = v.pointer("/LastLapTime/Value") {
                    if !laptime.is_empty() {
                        insert_hashmap_vec(&mut laptimes, rn, laptime.clone());
                    }
                }

                // sectortimes
                if let Some(Value::Object(sectors)) = v.pointer("/Sectors") {
                    if let Some(existing_key) = sectortimes.get_mut(rn) {
                        for (sector_nr, sector) in sectors {
                            if let Some(Value::String(sector_value)) = sector.pointer("/Value") {
                                if !sector_value.is_empty() {
                                    insert_hashmap_vec(
                                        existing_key,
                                        sector_nr,
                                        sector_value.clone(),
                                    );
                                }
                            }
                        }
                    } else {
                        let mut driver: HashMap<String, Vec<string::String>> = HashMap::new();

                        for (sector_nr, sector) in sectors {
                            if let Some(Value::String(sector_value)) = sector.pointer("/Value") {
                                if !sector_value.is_empty() {
                                    insert_hashmap_vec(
                                        &mut driver,
                                        sector_nr,
                                        sector_value.clone(),
                                    );
                                }
                            }
                        }

                        if !driver.is_empty() {
                            sectortimes.insert(rn.to_owned(), driver);
                        }
                    }
                }
            }
        };
    }

    (
        serde_json::to_value(weather).unwrap(),
        serde_json::to_value(gaps).unwrap(),
        serde_json::to_value(laptimes).unwrap(),
        serde_json::to_value(sectortimes).unwrap(),
    )
}

#[derive(Debug)]
pub struct Realtime {
    timestamp: Option<DateTime<Utc>>,
    state: Value,
}

#[derive(Debug, Clone)]
pub struct AsyncState {
    pub state: Value,
    pub current_timestamp: DateTime<Utc>,
    pub next_timestamp: DateTime<Utc>,
}
