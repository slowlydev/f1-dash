use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;

// GUYS I THINK THE STRUCTS ARE PUBLIC
// (╯°□°)╯︵ ┻━┻

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct SocketData {
    pub C: Option<String>,
    pub M: Option<Vec<SocketDataPayload>>,
    pub G: Option<String>,
    pub H: Option<String>,
    pub I: Option<String>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct SocketDataPayload {
    pub A: Vec<Value>, // TODO fix
    pub H: String,
    pub M: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct TimingDataMessage {
    pub Lines: HashMap<String, Driver>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct WeatherMessage {
    pub Humidity: String,
    pub Pressure: String,
    pub Rainfall: String,
    pub WindSpeed: String,
    pub WindDirection: String,
    pub AirTemp: String,
    pub TrackTemp: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct RaceControlMessages {
    pub Messages: HashMap<String, RaceControlMessage>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct RaceControlMessage {
    pub Message: String,
    pub Utc: String,

    pub Category: Option<String>,
    pub Flag: Option<String>,
    pub RacingNumber: Option<String>,
    pub Scope: Option<String>,
}

// {
// 	"63":{
// 		"GapToLeader": "+2.276",
// 		"IntervalToPositionAhead": {
// 			"Value": "+0.551"
// 		},
// 		"NumberOfLaps":1,
// 		"LastLapTime": {
// 			"Value": "1:41.134"
// 		},
// 		"Sectors":{
// 			"2":{
// 				"OverallFastest":true,
// 				"PersonalFastest":true,
// 				"Value":"26.229",
// 				"Segments": {
// 					"6": {
// 						"Status": 2049
// 					}
// 				}
// 			}
// 		},
// 		"BestSectors": {
// 			"1": {
// 				"Position": 10,
// 				"Value": "34.749"
// 			}
// 		}
// 		"Speeds":{
//       "I2":{
// 				"OverallFastest":true,
//       	"PersonalFastest":true,
//       	"Value":"191"
//     	},
// 			"FL":{
// 				"OverallFastest":true,
// 				"PersonalFastest":true,
// 				"Value":"270"
// 			},
// 		 "I1": { "Value": "213" },
// 		 "I2": { "Value": "" },
// 		 "ST": { "Value": "" }
// 		},
// 	}
// }

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Driver {
    pub NumberOfLaps: Option<i16>,
    pub GapToLeader: Option<String>,

    pub IntervalToPositionAhead: Option<ValueObject>,
    pub LastLapTime: Option<LastLapTimeObject>,

    pub Speeds: Option<HashMap<String, Speed>>,
    pub Sectors: Option<HashMap<String, Sector>>,
    pub BestSectors: Option<HashMap<String, BestSector>>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct LastLapTimeObject {
    pub Value: String,
    pub PersonalFastest: bool,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Sector {
    pub Value: Option<String>,
    pub Segments: Option<HashMap<String, Segment>>,
    pub PersonalFastest: Option<bool>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Segment {
    pub Status: i64, // 2048 BAD, 2049 PB, 0 OB ????
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Speed {
    pub Value: Option<String>,
    pub OverallFastest: Option<bool>,
    pub PersonalFastest: Option<bool>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct ValueObject {
    pub Value: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct BestSector {
    pub Position: i32,
    pub Value: String,
}
