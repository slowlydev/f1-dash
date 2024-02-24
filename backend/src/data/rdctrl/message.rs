// create server message
// - initial updates
// - history from updates

use std::collections::HashMap;

use serde::Serialize;

use crate::db::{self, history::History};

use super::transformer;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct UpdateMessage {
    pub updates: transformer::Updates,
    pub history: db::history::History,
}

pub fn create_update_message(updates: transformer::Updates) -> UpdateMessage {
    // TODO create history updates out of updates with needing the db

    let mut history: History = History::new();

    for driver_timing in &updates.driver_timings {
        if let Some(lap_time) = driver_timing.lap_time {
            hash_map_save(&driver_timing.driver_nr, lap_time, &mut history.lap_time)
        };

        if let Some(gap) = driver_timing.gap_to_ahead {
            hash_map_save(&driver_timing.driver_nr, gap, &mut history.ahead_gap)
        };

        if let Some(gap) = driver_timing.gap_to_leader {
            hash_map_save(&driver_timing.driver_nr, gap, &mut history.leader_gap)
        };
    }

    for driver_sector in &updates.driver_sectors {
        if let Some(time) = driver_sector.time {
            sector_hash_map_save(
                &driver_sector.driver_nr,
                &driver_sector.number,
                time,
                &mut history.sectors,
            );
        };
    }

    if let Some(weather) = &updates.weather {
        let weather_history = db::history::WeatherHistory {
            humidity: weather.humidity.and_then(|v| Some(vec![v])),
            pressure: weather.pressure.and_then(|v| Some(vec![v])),
            rainfall: weather.rainfall.and_then(|v| Some(vec![v])),
            wind_direction: weather.wind_direction.and_then(|v| Some(vec![v])),
            wind_speed: weather.wind_speed.and_then(|v| Some(vec![v])),
            air_temp: weather.air_temp.and_then(|v| Some(vec![v])),
            track_temp: weather.track_temp.and_then(|v| Some(vec![v])),
        };

        history.weather = Some(weather_history);
    };

    UpdateMessage { updates, history }
}

fn hash_map_save<T>(nr: &str, item: T, map: &mut HashMap<String, Vec<T>>) {
    if let Some(vec) = map.get_mut(nr) {
        vec.push(item);
    } else {
        map.insert(nr.to_owned(), vec![item]);
    }
}

fn sector_hash_map_save<T>(
    nr: &str,
    sector: &i64,
    item: T,
    map: &mut HashMap<String, HashMap<i64, Vec<T>>>,
) {
    if let Some(vec) = map.get_mut(nr) {
        if let Some(sector_vec) = vec.get_mut(sector) {
            sector_vec.push(item);
        } else {
            vec.insert(sector.to_owned(), vec![item]);
        }
    } else {
        let mut sector_map: HashMap<i64, Vec<T>> = HashMap::new();
        sector_map.insert(sector.to_owned(), vec![item]);
        map.insert(nr.to_owned(), sector_map);
    }
}
