use std::collections::HashMap;

use serde::Serialize;
use serde_json::Value;

use crate::{
    client,
    data::odctrl::{self},
};

// -- history used in odctrl initials --

fn create_history(queries: odctrl::history::Queries) -> odctrl::history::History {
    let (gap_leader, gap_front, lap_time, sectors, weather) = queries;

    let mut history = odctrl::history::create_empty();

    if let Ok(gap_leader) = gap_leader {
        let mut gap_leader_map: HashMap<String, Vec<i64>> = HashMap::new();

        for driver in gap_leader {
            if let (Some(key), Some(gaps)) = (driver.key, driver.gaps) {
                let parsed_gaps: Vec<_> = gaps
                    .iter()
                    .filter_map(|gap| odctrl::history::parse_string_duration(gap))
                    .collect();

                gap_leader_map.insert(key, parsed_gaps);
            }
        }

        history.gap_leader = Some(gap_leader_map);
    }

    if let Ok(gap_front) = gap_front {
        let mut gap_front_map: HashMap<String, Vec<i64>> = HashMap::new();

        for driver in gap_front {
            if let (Some(key), Some(gaps)) = (driver.key, driver.gaps) {
                let parsed_gaps: Vec<_> = gaps
                    .iter()
                    .filter_map(|gap| odctrl::history::parse_string_duration(gap))
                    .collect();

                gap_front_map.insert(key, parsed_gaps);
            }
        }

        history.gap_front = Some(gap_front_map);
    }

    if let Ok(lap_time) = lap_time {
        let mut lap_time_map: HashMap<String, Vec<i64>> = HashMap::new();

        for driver in lap_time {
            if let (Some(key), Some(laps)) = (driver.key, driver.gaps) {
                let parsed_laps: Vec<_> = laps
                    .iter()
                    .filter_map(|gap| odctrl::history::parse_lap_time(gap))
                    .collect();

                lap_time_map.insert(key, parsed_laps);
            }
        }

        history.lap_time = Some(lap_time_map);
    }

    if let Ok(sectors) = sectors {
        let mut sector_map: HashMap<String, HashMap<String, Vec<i64>>> = HashMap::new();

        for sector in sectors {
            if let (Some(driver_nr), Some(sector_nr), Some(values)) =
                (sector.key, sector.sector_nr, sector.values)
            {
                let driver = sector_map.entry(driver_nr).or_insert_with(HashMap::new);
                let driver_sector = driver.entry(sector_nr).or_insert_with(Vec::new);

                let mut parsed_sector_times: Vec<_> = values
                    .iter()
                    .filter_map(|gap| odctrl::history::parse_string_duration(gap))
                    .collect();

                driver_sector.append(&mut parsed_sector_times);
            }
        }

        history.sectors = Some(sector_map);
    }

    if let Ok(weather) = weather {
        let mut weather_map = odctrl::history::Weather {
            air_temp: vec![],
            track_temp: vec![],
            humidity: vec![],
            pressure: vec![],
            rainfall: vec![],
            wind_direction: vec![],
            wind_speed: vec![],
        };

        for entry in weather {
            if let (
                Some(air_temp),
                Some(track_temp),
                Some(humidity),
                Some(pressure),
                Some(rainfall),
                Some(wind_direction),
                Some(wind_speed),
            ) = (
                entry.air_temp,
                entry.track_temp,
                entry.humidity,
                entry.pressure,
                entry.rainfall,
                entry.wind_direction,
                entry.wind_speed,
            ) {
                weather_map.air_temp.push(air_temp);
                weather_map.track_temp.push(track_temp);
                weather_map.humidity.push(humidity);
                weather_map.pressure.push(pressure);
                weather_map.rainfall.push(rainfall);
                weather_map.wind_direction.push(wind_direction);
                weather_map.wind_speed.push(wind_speed);
            }
        }

        history.weather = Some(weather_map);
    }

    history
}

// -- rdctrl and odctrl --

#[derive(Serialize)]
pub struct InitialMessage {
    initial: Value,
    history: Option<odctrl::history::History>,
}

pub fn create_initial(value: Value, queries: Option<odctrl::history::Queries>) -> InitialMessage {
    let history = match queries {
        Some(queries) => Some(create_history(queries)),
        None => None,
    };

    InitialMessage {
        initial: value,
        history,
    }
}

// -- rdctrl only --

#[derive(Serialize)]
pub struct UpdateMessage {
    update: HashMap<String, Value>,
}

pub fn create_update(updates: HashMap<String, client::parser::Update>) -> UpdateMessage {
    let mut map: HashMap<String, Value> = HashMap::new();

    for (_, update) in updates {
        map.insert(update.category, update.state);
    }

    UpdateMessage { update: map }
}

// -- odctrl only --

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DelayedInitialMessage {
    delayed_initial: Value,
    delayed_initial_history: odctrl::history::History,
}

pub fn create_delayed_initial(
    value: Value,
    queries: odctrl::history::Queries,
) -> DelayedInitialMessage {
    let history = create_history(queries);

    DelayedInitialMessage {
        delayed_initial: value,
        delayed_initial_history: history,
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DelayedUpdatesMessage {
    delayed_updates: HashMap<String, Vec<Value>>,
}

pub fn create_delayed_updates(updates: Vec<odctrl::query::Update>) -> DelayedUpdatesMessage {
    let mut map: HashMap<String, Vec<Value>> = HashMap::new();

    for update in updates {
        let entry = map.entry(update.category).or_insert_with(Vec::new);
        entry.push(update.state);
    }

    DelayedUpdatesMessage {
        delayed_updates: map,
    }
}
