use sqlx::PgPool;

use crate::db;

use super::transformer::TableUpdate;

// the keeper is here to store all transformed updates into the database ASAP

pub async fn keep(pool: PgPool, updates: Vec<TableUpdate>) {
    for update in updates {
        tokio::spawn(handle_updates(pool.clone(), update));
    }
}

async fn handle_updates(pool: PgPool, update: TableUpdate) {
    match update {
        TableUpdate::Weather(weather) => {
            db::insert::weather(pool, weather).await;
        }
        TableUpdate::ExtrapolatedClock(extrapolated_clock) => {
            db::insert::extrapolated_clock(pool, extrapolated_clock).await;
        }
        TableUpdate::LapCount(lap_count) => {
            db::insert::lap_count(pool, lap_count).await;
        }
        TableUpdate::GeneralTiming(general_timing) => {
            db::insert::general_timing(pool, general_timing).await;
        }
        TableUpdate::TeamRadio(team_radios) => {
            for team_radio in team_radios {
                tokio::spawn(db::insert::team_radio(pool.clone(), team_radio));
            }
        }
        TableUpdate::RaceControlMessages(race_control_messages) => {
            for message in race_control_messages {
                tokio::spawn(db::insert::race_control_messages(pool.clone(), message));
            }
        }
        TableUpdate::DriverTiming(driver_timings) => {
            for driver_timing in driver_timings {
                tokio::spawn(db::insert::driver_timing(pool.clone(), driver_timing));
            }
        }
        TableUpdate::DriverSector(driver_sectors) => {
            for driver_sector in driver_sectors {
                tokio::spawn(db::insert::driver_sector(pool.clone(), driver_sector));
            }
        }
        TableUpdate::DriverSectorSegment(driver_sector_segments) => {
            for driver_sector_segment in driver_sector_segments {
                tokio::spawn(db::insert::driver_sector_segment(
                    pool.clone(),
                    driver_sector_segment,
                ));
            }
        }
        TableUpdate::DriverStint(driver_stints) => {
            for driver_stint in driver_stints {
                tokio::spawn(db::insert::driver_stint(pool.clone(), driver_stint));
            }
        }
        TableUpdate::Driver(drivers) => {
            for driver in drivers {
                tokio::spawn(db::insert::driver(pool.clone(), driver));
            }
        }
        TableUpdate::DriverStats(driver_stats) => {
            for driver_stat in driver_stats {
                tokio::spawn(db::insert::driver_stats(pool.clone(), driver_stat));
            }
        }
        TableUpdate::DriverSectorStats(driver_sector_stats) => {
            for driver_sector_stat in driver_sector_stats {
                tokio::spawn(db::insert::driver_sector_stats(
                    pool.clone(),
                    driver_sector_stat,
                ));
            }
        }
        TableUpdate::DriverSpeeds(driver_speeds) => {
            for driver_speed in driver_speeds {
                tokio::spawn(db::insert::driver_speeds(pool.clone(), driver_speed));
            }
        }
        TableUpdate::DriverCarData(driver_cars) => {
            for driver_car in driver_cars {
                tokio::spawn(db::insert::driver_car_data(pool.clone(), driver_car));
            }
        }
        TableUpdate::DriverPosition(driver_positions) => {
            for driver_position in driver_positions {
                tokio::spawn(db::insert::driver_position(pool.clone(), driver_position));
            }
        }
    }
}
