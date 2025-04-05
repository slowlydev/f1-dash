pub const F1_BASE_URL: &str = "livetiming.formula1.com/signalr";

pub const SIGNALR_HUB: &str = r#"[{ "name": "Streaming" }]"#;

pub const SIGNALR_SUBSCRIBE: &str = r#"{
    "H": "Streaming",
    "M": "Subscribe",
    "A": [[
        "Heartbeat",
        "CarData.z",
        "Position.z",
        "ExtrapolatedClock",
        "TopThree",
        "RcmSeries",
        "TimingStats",
        "TimingAppData",
        "WeatherData",
        "TrackStatus",
        "SessionStatus",
        "DriverList",
        "RaceControlMessages",
        "SessionInfo",
        "SessionData",
        "LapCount",
        "TimingData",
        "TeamRadio",
        "PitLaneTimeCollection",
        "ChampionshipPrediction"
    ]],
    "I": 1,
}"#;
