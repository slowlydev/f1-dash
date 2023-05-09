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

#[derive(Serialize, Deserialize, Debug)]
pub enum Message {
    String,
    TimingDataMessage {
        Lines: HashMap<String, Driver>,
    },
    WeatherMessage {
        Humidity: String,
        Pressure: String,
        Rainfall: String,
        WindSpeed: String,
        WindDirection: String,
        AirTemp: String,
        TrackTemp: String,
    },
    RaceControlMessage {
        Lines: Vec<RaceControlMessage>,
    },
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
struct RaceControlMessage {
    Message: String,
    Utc: String,

    Category: Option<String>,
    Flag: Option<String>,
    RacingNumber: Option<String>,
    Scope: Option<String>,
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
    pub LastLapTime: Option<ValueObject>,

    pub Speeds: Option<HashMap<String, Speed>>,
    pub Sectors: Option<HashMap<String, Sector>>,
    pub BestSectors: Option<HashMap<String, BestSector>>,
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
