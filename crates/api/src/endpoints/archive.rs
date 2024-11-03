use axum::extract::Path;
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

pub async fn get_sessions_for_year(
    Path(year): Path<u32>,
) -> Result<axum::Json<Vec<Meeting>>, axum::http::StatusCode> {
    let url = format!("https://livetiming.formula1.com/static/{year}/Index.json");

    let result = reqwest::get(url).await;
    let res = match result {
        Ok(res) => res,
        Err(err) => {
            error!("Error fetching {} sessions: {}", year, err);
            return Err(axum::http::StatusCode::BAD_GATEWAY);
        }
    };

    let text = match res.status() {
        axum::http::StatusCode::OK => res.text().await.unwrap_or(String::new()),
        status => {
            return Err(status);
        }
    };

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
