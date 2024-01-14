use chrono::{DateTime, Utc};
use serde_json::Value;
use std::collections::HashMap;

use crate::{merge, parser};

#[derive(Debug)]
pub struct History {
    pub initial: Option<Value>,
    pub updates: Vec<parser::Update>,
    pub delay_states: HashMap<i64, AsyncState>,
    pub realtime: Option<Realtime>,
}

impl History {
    pub fn new() -> History {
        History {
            initial: None,
            updates: Vec::new(),
            delay_states: HashMap::new(),
            realtime: None,
        }
    }

    pub fn set_intitial(&mut self, state: Value) {
        self.realtime = Some(Realtime {
            timestamp: None,
            state: state.clone(),
        });

        self.initial = Some(state);
    }

    pub fn add_updates(&mut self, updates: &mut Vec<parser::Update>) {
        // we add the update to the updates vec
        // and update the realtime state

        if updates.len() < 1 {
            return;
        };

        self.updates.append(updates);

        if let Some(ref mut realtime) = self.realtime {
            for update in updates {
                // realtime.timestamp = Some(update.timestamp);
                realtime.timestamp = Some(Utc::now());
                merge::merge(&mut realtime.state, &update.state);
            }
        }
    }

    pub fn get_all_delayed(&mut self) -> HashMap<i64, Value> {
        let mut map = HashMap::new();

        for (k, _) in self.delay_states.clone() {
            if let Some(val) = self.get_delayed(&k) {
                map.insert(k.to_owned(), val);
            }
        }

        map
    }

    pub fn get_delayed(&mut self, delay: &i64) -> Option<Value> {
        if let Some(existing) = self.delay_states.get_mut(&delay) {
            let delayed_timestamp = chrono::Utc::now().timestamp() - delay;

            if existing.next_timestamp.timestamp() >= delayed_timestamp {
                let mut latest_update_index: usize = 0;

                for (pos, update) in self.updates.iter().enumerate() {
                    if update.timestamp.timestamp() > existing.current_timestamp.timestamp() {
                        continue;
                    };

                    if update.timestamp.timestamp() > delayed_timestamp {
                        continue;
                    };

                    latest_update_index = pos;

                    merge::merge(&mut existing.state, &update.state);

                    // inject updated history things into exsisting
                }

                let current = self.updates.get(latest_update_index).unwrap();
                let next = self.updates.get(latest_update_index + 1).unwrap();

                existing.current_timestamp = current.timestamp;
                existing.next_timestamp = next.timestamp;
            }

            if let Value::Object(ref mut state) = existing.state {
                inject_history(
                    state,
                    self.updates
                        .iter()
                        .filter(|up| up.timestamp.timestamp() < delayed_timestamp)
                        .collect(),
                );
            }

            return Some(existing.state.clone());
        };

        if let Some(initial_state) = &self.initial {
            let mut base = initial_state.clone();

            let delayed_timestamp = chrono::Utc::now().timestamp() - delay;

            let mut latest_update_index: usize = 0;

            for (pos, update) in self.updates.iter().enumerate() {
                if update.timestamp.timestamp() <= delayed_timestamp {
                    continue;
                };

                if update.timestamp.timestamp() > delayed_timestamp {
                    continue;
                };

                latest_update_index = pos;

                merge::merge(&mut base, &update.state);
            }

            let current = self.updates.get(latest_update_index).unwrap();
            let next = self.updates.get(latest_update_index + 1).unwrap();

            let mut async_state = AsyncState {
                state: base,
                current_timestamp: current.timestamp,
                next_timestamp: next.timestamp,
            };

            self.delay_states
                .insert(delay.to_owned(), async_state.clone());

            if let Value::Object(ref mut state) = async_state.state {
                inject_history(
                    state,
                    self.updates
                        .iter()
                        .filter(|up| up.timestamp.timestamp() < delayed_timestamp)
                        .collect(),
                );
            }

            return Some(async_state.state);
        }

        None
    }

    pub fn get_realtime(&self) -> Option<Value> {
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
    let weather_updates: Vec<&Value> =
        updates
            .iter()
            .filter(|up| up.catagory == "WeatherData")
            .map(|up| &up.state)
            .collect();

    let timing_updates: Vec<&Value> =
        updates
            .iter()
            .filter(|up| up.catagory == "TimingData")
            .map(|up| &up.state)
            .collect();

    let history = value_history_computation(weather_updates, timing_updates);

    state.insert(
        "WeatherData.history".to_owned(),
        serde_json::to_value(history.0).unwrap(),
    );

    state.insert(
        "TimingData.Gap.history".to_owned(),
        serde_json::to_value(history.1).unwrap(),
    );

    state.insert(
        "TimingData.Laptime.history".to_owned(),
        serde_json::to_value(history.2).unwrap(),
    );

    state.insert(
        "TimingData.Sectortime.history".to_owned(),
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
    let mut weather: HashMap<String, Vec<Value>> = HashMap::new();
    let mut gaps: HashMap<String, Vec<Value>> = HashMap::new();
    let mut laptimes: HashMap<String, Vec<Value>> = HashMap::new();
    let mut sectortimes: HashMap<String, HashMap<String, Vec<Value>>> = HashMap::new();

    for update in &weather_updates {
        if let Value::Object(obj) = update {
            for (k, v) in obj {
                insert_hashmap_vec(&mut weather, k, v.clone());
            }
        }
    }

    for update in &timing_updates {
        if let Some(Value::Object(lines)) = update.pointer("/Lines") {
            for (rn, v) in lines {
                // gaps
                if let Some(gap) = v.pointer("/IntervalToPositionAhead/Value") {
                    insert_hashmap_vec(&mut gaps, rn, gap.clone());
                }

                // laptimes
                if let Some(laptime) = v.pointer("/LastLapTime") {
                    insert_hashmap_vec(&mut laptimes, rn, laptime.clone());
                }

                // sectortimes
                if let Some(Value::Object(sectors)) = v.pointer("/Sectors") {
                    if let Some(existing_key) = sectortimes.get_mut(rn) {
                        for (sector_nr, v) in sectors {
                            insert_hashmap_vec(existing_key, sector_nr, v.clone());
                        }
                    } else {
                        let mut driver: HashMap<String, Vec<Value>> = HashMap::new();

                        for (sector_nr, v) in sectors {
                            insert_hashmap_vec(&mut driver, sector_nr, v.clone());
                        }
                        sectortimes.insert(rn.to_owned(), driver);
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
