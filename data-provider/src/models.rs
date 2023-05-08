use scylla::ValueList;

#[derive(Debug, ValueList)]
pub struct WeatherData {
    pub humidity: f64,
    pub pressure: f64,
    pub rainfall: f64,
    pub wind_direction: f64,
    pub wind_speed: f64,
    pub air_temp: f64,
    pub track_temp: f64,
    pub time: String,
}

#[derive(Debug, ValueList)]
pub struct RaceControlMessage {
    pub message: String,
    // pub flag: String,
    pub time: String,
}
// TODO figure out how to use as much data as possible
//             "Category":"Flag",
//             "Flag":"BLACK AND WHITE",
//             "Message":"BLACK AND WHITE FLAG FOR CAR 11 (PER) - CROSSING THE LINE AT PIT ENTRY",
//             "RacingNumber":"11",
//             "Scope":"Driver",
//             "Utc":"2023-05-05T21:48:04"

// const T = {
//     "C": String("d-C35AF5C5-B,0|Duq,0|Dur,11|d,153|p,1398|o,139A|a,2|Y,30D|DX,0|n,2E8|W,E7|c,55|g,5|X,24|l,13|j,1|r,15|Z,F|s,42DB"),
//     "M": Array [
//         Object {
//             "A": Array [
//                 String("TimingData"),
//                 Object {"Lines": Object {"55": Object {"GapToLeader": String("+4.807"), "IntervalToPositionAhead": Object {"Value": String("+0.677")}}}},
//                 String("2023-05-07T19:55:57.496Z")
//             ],
//             "H": String("Streaming"),
//             "M": String("feed")
//         }
//         ]
//     }
