use serde::Serialize;
use sqlx::PgPool;

use crate::{
    data::rdctrl::{
        message::{hash_map_save, sector_hash_map_save},
        transformer,
    },
    db,
};

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct InitialMessage {
    pub initial: transformer::State,
    pub history: db::history::History,
}

pub async fn create_initial_message(pool: PgPool) -> Option<InitialMessage> {
    let mut history: db::history::History = db::history::History::new();

    let (history_leader_gap, history_ahead_gap, history_lap_time, history_sectors, history_weather) = tokio::join!(
        db::history::driver_leader_gap(pool.clone()),
        db::history::driver_ahead_gap(pool.clone()),
        db::history::driver_lap_time(pool.clone()),
        db::history::driver_sector(pool.clone()),
        db::history::weather(pool.clone())
    );

    if let Some(history_leader_gap) = history_leader_gap {
        for leader_gap in history_leader_gap {
            if let Some(gaps) = leader_gap.gaps {
                for gap in gaps {
                    hash_map_save(&leader_gap.driver_nr, gap, &mut history.leader_gap);
                }
            }
        }
    }

    if let Some(history_ahead_gap) = history_ahead_gap {
        for ahead_gap in history_ahead_gap {
            if let Some(gaps) = ahead_gap.gaps {
                for gap in gaps {
                    hash_map_save(&ahead_gap.driver_nr, gap, &mut history.ahead_gap);
                }
            }
        }
    }

    if let Some(history_lap_time) = history_lap_time {
        for lap_time in history_lap_time {
            if let Some(lap_times) = lap_time.lap_times {
                for lap in lap_times {
                    hash_map_save(&lap_time.driver_nr, lap, &mut history.lap_time);
                }
            }
        }
    }

    if let Some(history_sectors) = history_sectors {
        for sector in history_sectors {
            if let Some(sector_times) = sector.times {
                for time in sector_times {
                    sector_hash_map_save(
                        &sector.driver_nr,
                        &sector.sector_nr,
                        time,
                        &mut history.sectors,
                    );
                }
            }
        }
    }

    history.weather = history_weather;

    let mut initial: transformer::State = transformer::State::new();

    let (
        weather,
        extrapolated_clock,
        lap_count,
        session_info,
        meeting,
        track_status,
        general_timing,
        team_radios,
        race_control_messages,
        driver_timing,
        driver_sector,
        driver_speeds,
        driver_sector_segments,
        driver_stints,
        driver,
        driver_stats,
        driver_sector_stats,
        driver_car_data,
        driver_position,
    ) = tokio::join!(
        db::recon::weather(pool.clone()),
        db::recon::extrapolated_clock(pool.clone()),
        db::recon::lap_count(pool.clone()),
        db::recon::session_info(pool.clone()),
        db::recon::meeting(pool.clone()),
        db::recon::track_status(pool.clone()),
        db::recon::general_timing(pool.clone()),
        db::recon::team_radio(pool.clone()),
        db::recon::race_control_messages(pool.clone()),
        db::recon::driver_timing(pool.clone()),
        db::recon::driver_sector(pool.clone()),
        db::recon::driver_speeds(pool.clone()),
        db::recon::driver_sector_segment(pool.clone()),
        db::recon::driver_stints(pool.clone()),
        db::recon::driver(pool.clone()),
        db::recon::driver_stats(pool.clone()),
        db::recon::driver_sector_stats(pool.clone()),
        db::recon::driver_car_data(pool.clone()),
        db::recon::driver_position(pool.clone())
    );

    initial.weather = weather;
    initial.extrapolated_clock = extrapolated_clock;
    initial.lap_count = lap_count;
    initial.session_info = session_info;
    initial.meeting = meeting;
    initial.track_status = track_status;
    initial.general_timing = general_timing;

    if let Some(team_radios) = team_radios {
        initial.team_radios = team_radios;
    }

    if let Some(race_control_messages) = race_control_messages {
        initial.race_control_messages = race_control_messages;
    }

    if let Some(driver_timing) = driver_timing {
        initial.driver_timings = driver_timing;
    }

    if let Some(driver_sector) = driver_sector {
        initial.driver_sectors = driver_sector;
    }

    if let Some(driver_speeds) = driver_speeds {
        initial.driver_speeds = driver_speeds;
    }

    if let Some(driver_sector_segments) = driver_sector_segments {
        initial.driver_sector_segments = driver_sector_segments;
    }

    if let Some(driver_stints) = driver_stints {
        initial.driver_stints = driver_stints;
    }

    if let Some(driver) = driver {
        initial.drivers = driver;
    }

    if let Some(driver_stats) = driver_stats {
        initial.driver_stats = driver_stats;
    }

    if let Some(driver_sector_stats) = driver_sector_stats {
        initial.driver_sector_stats = driver_sector_stats;
    }

    if let Some(driver_car_data) = driver_car_data {
        initial.car_data = driver_car_data;
    }

    if let Some(driver_position) = driver_position {
        initial.positions = driver_position;
    }

    Some(InitialMessage { initial, history })
}
