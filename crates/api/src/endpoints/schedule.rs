use chrono::{DateTime, Datelike, NaiveDateTime, TimeZone, Utc};
use ical::parser::ical::component::IcalEvent;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::io::BufReader;
use tracing::{debug, error, warn};

use cached::proc_macro::io_cached;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Session {
    kind: String,
    start: DateTime<Utc>,
    end: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Round {
    name: String,
    country_name: String,
    country_key: Option<String>,
    start: DateTime<Utc>,
    end: DateTime<Utc>,
    sessions: Vec<Session>,
    over: bool,
}

fn parse_ical_utc(date_string: &str) -> Result<DateTime<Utc>, anyhow::Error> {
    let naive_datetime = NaiveDateTime::parse_from_str(date_string, "%Y%m%dT%H%M%SZ")?;
    Ok(Utc.from_utc_datetime(&naive_datetime))
}

fn get_property(event: &IcalEvent, name: &str) -> Result<String, anyhow::Error> {
    for property in &event.properties {
        if property.name == name {
            if let Some(value) = &property.value {
                return Ok(value.clone());
            }
        }
    }

    Err(anyhow::format_err!(
        "failed to find property {} on event {:?}",
        name,
        event
    ))
}

fn find_round_mut<'a>(rounds: &'a mut Vec<Round>, name: &str) -> Option<&'a mut Round> {
    rounds.iter_mut().find(|r| r.name == name)
}

fn parse_name(full_name: &str) -> Option<(String, String)> {
    let regex = Regex::new(r"FORMULA 1 (?P<name>.+) - (?P<kind>.+)").ok()?;
    let captures = regex.captures(full_name)?;
    Some((captures["name"].to_owned(), captures["kind"].to_owned()))
}

fn new_round(event: IcalEvent, name: &str, kind: &str) -> Result<Round, anyhow::Error> {
    let country = get_property(&event, "LOCATION")?;
    let start_str = get_property(&event, "DTSTART")?;
    let end_str = get_property(&event, "DTEND")?;

    let start: DateTime<Utc> = parse_ical_utc(&start_str)?;
    let end: DateTime<Utc> = parse_ical_utc(&end_str)?;

    let sessions = vec![Session {
        kind: kind.to_owned(),
        start,
        end,
    }];

    let round = Round {
        name: name.to_owned(),
        country_name: country,
        country_key: None,
        start,
        end,
        sessions,
        over: false,
    };

    Ok(round)
}

fn update_round(event: IcalEvent, round: &mut Round, kind: &str) -> Result<(), anyhow::Error> {
    let start_str = get_property(&event, "DTSTART")?;
    let end_str = get_property(&event, "DTEND")?;

    let start: DateTime<Utc> = parse_ical_utc(&start_str)?;
    let end: DateTime<Utc> = parse_ical_utc(&end_str)?;

    let new_session = Session {
        kind: kind.to_owned(),
        start,
        end,
    };

    round.sessions.push(new_session);

    if start < round.start {
        round.start = start;
    }

    if end > round.end {
        round.end = end;
    }

    Ok(())
}

#[io_cached(
    map_error = r##"|e| anyhow::anyhow!(format!("disk cache error {:?}", e))"##,
    disk = true,
    time = 1800
)]
async fn get_schedule(year: i32) -> Result<Vec<Round>, anyhow::Error> {
    // webcal://ics.ecal.com/ecal-sub/678ceabe7955100008edda00/Formula%201.ics
    // *note this is a link created by entering a email and other info on the f1 website
    // it expires every season ...
    let cal_url = "https://ics.ecal.com/ecal-sub/678ceabe7955100008edda00/Formula%201.ics";
    let cal_bytes = reqwest::get(cal_url).await?.bytes().await?;
    let cal_buf = BufReader::new(cal_bytes.as_ref());
    let cal_reader = ical::IcalParser::new(cal_buf);

    let mut rounds: Vec<Round> = vec![];

    for line in cal_reader {
        let calendar = line?;

        for event in calendar.events {
            let full_name = get_property(&event, "SUMMARY");

            let Ok(full_name) = full_name else {
                error!("failed to get full name for event: {:?}", event);
                continue;
            };

            let Some((name, kind)) = parse_name(&full_name) else {
                error!("failed to parse name for event: {}", full_name);
                continue;
            };

            match find_round_mut(&mut rounds, &name) {
                Some(round) => match update_round(event, round, &kind) {
                    Ok(_) => {}
                    Err(e) => {
                        warn!("failed to update round: {}", e);
                    }
                },
                None => {
                    let new_round = match new_round(event, &name, &kind) {
                        Ok(new_round) => new_round,
                        Err(err) => {
                            error!(?name, ?err, "failed to create round");
                            continue;
                        }
                    };

                    if new_round.start.year() != year {
                        debug!("filtering round for year: {}", name);
                        continue;
                    }

                    rounds.push(new_round);
                }
            }
        }
    }

    rounds.sort_unstable_by(|a, b| a.start.cmp(&b.start));

    let utc_now = Utc::now();

    for round in &mut rounds {
        round.over = round.end < utc_now;

        round
            .sessions
            .sort_unstable_by(|a, b| a.start.cmp(&b.start));
    }

    Ok(rounds)
}

pub async fn get() -> Result<axum::Json<Vec<Round>>, axum::http::StatusCode> {
    let year = chrono::Utc::now().year();
    let schedule = get_schedule(year).await;

    match schedule {
        Ok(schedule) => Ok(axum::Json(schedule)),
        Err(_) => {
            error!("failed to create schedule for year {}", year);
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_next() -> Result<axum::Json<Round>, axum::http::StatusCode> {
    let year = chrono::Utc::now().year();
    let schedule = get_schedule(year).await;

    match schedule {
        Ok(schedule) => {
            let not_over: Vec<Round> = schedule.into_iter().filter(|r| !r.over).collect();
            let next_round = not_over.first().cloned();

            match next_round {
                Some(next_round) => Ok(axum::Json(next_round)),
                None => Err(axum::http::StatusCode::NO_CONTENT),
            }
        }
        Err(_) => {
            error!("failed to create schedule for year {}", year);
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
