use axum::{extract::Path, Json};
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
    country: Country,
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
pub async fn fetch_sessions_for_year(year: u32) -> Result<MeetingResponse, anyhow::Error> {
    let url = format!("https://livetiming.formula1.com/static/{year}/Index.json");
    let res = reqwest::get(url).await?;
    let text = res.text().await?;
    let json = serde_json::from_str::<MeetingResponse>(&text)?;
    Ok(json)
}

pub async fn get_sessions_for_year(
    Path(year): Path<u32>,
) -> Result<axum::Json<Vec<Meeting>>, axum::http::StatusCode> {
    let res = fetch_sessions_for_year(year).await;

    match res {
        Ok(mut res) => {
            for (_, el) in res.meetings.iter_mut().enumerate() {
                el.sessions.retain(|s| s.key != -1);
            }
            Ok(Json(res.meetings))
        }
        Err(err) => {
            error!(?err, ?year, "failed to get archive");
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
