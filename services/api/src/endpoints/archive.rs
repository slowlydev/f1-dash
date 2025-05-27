use axum::extract::Path;
use cached::proc_macro::io_cached;
use serde::{Deserialize, Serialize};
use serde_json;
use tracing::error;

// A meeting represents a full race or testing weekend.
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase", deserialize = "PascalCase"))]
pub struct Meeting {
    key: u32,
    code: String,
    number: u8,
    location: String,
    official_name: String,
    name: String,
    // i think the name as string should suffice, right?...
    country: Country,
    // might not need circuit?
    // circuit: String,
    sessions: Vec<RaceSession>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase", deserialize = "PascalCase"))]
struct Country {
    key: i32,
    code: String,
    name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase", deserialize = "PascalCase"))]
pub struct MeetingResponse {
    year: u16,
    meetings: Vec<Meeting>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all(serialize = "camelCase", deserialize = "PascalCase"))]
pub struct RaceSession {
    key: i32,
    r#type: String,
    #[serde(default)]
    name: String,
    #[serde(default)]
    path: String,
    #[serde(default)]
    start_date: String,
    #[serde(default)]
    end_date: String,
}

#[io_cached(
    map_error = r##"|e| anyhow::anyhow!(format!("disk cache error {:?}", e))"##,
    disk = true,
    time = 1800
)]
pub async fn fetch_sessions_for_year(year: u32) -> Result<String, anyhow::Error> {
    let url = format!("https://livetiming.formula1.com/static/{year}/Index.json");
    let res = reqwest::get(url).await?;
    let text = res.text().await?;
    Ok(text)
}

pub async fn get_sessions_for_year(
    Path(year): Path<u32>,
) -> Result<axum::Json<Vec<Meeting>>, axum::http::StatusCode> {
    let text = fetch_sessions_for_year(year).await.unwrap();

    let json = serde_json::from_str::<MeetingResponse>(&text);

    match json {
        Ok(mut json) => {
            for (_, el) in json.meetings.iter_mut().enumerate() {
                el.sessions.retain(|s| s.key != -1);
            }
            Ok(axum::Json(json.meetings))
        }
        Err(err) => {
            error!("{}", err);
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
