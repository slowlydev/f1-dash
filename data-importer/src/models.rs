use scylla::{frame::value::Timestamp, ValueList};
use uuid::Uuid;

#[derive(Debug, ValueList)]
pub struct WeatherData {
    pub id: Uuid,
    pub humidity: f64,
    pub pressure: f64,
    pub rainfall: i16,
    pub wind_direction: i16,
    pub wind_speed: f64,
    pub air_temp: f64,
    pub track_temp: f64,
    pub time: Timestamp,
}

#[derive(Debug, ValueList)]
pub struct RaceControlMessage {
    pub id: Uuid,
    pub message: String,
    // pub flag: String,
    pub time: Timestamp,
}
// TODO figure out how to use as much data as possible
//             "Category":"Flag",
//             "Flag":"BLACK AND WHITE",
//             "Message":"BLACK AND WHITE FLAG FOR CAR 11 (PER) - CROSSING THE LINE AT PIT ENTRY",
//             "RacingNumber":"11",
//             "Scope":"Driver",
//             "Utc":"2023-05-05T21:48:04"

#[derive(Debug, ValueList)]
pub struct LastLapTime {
    pub id: Uuid,
    pub driver_nr: i16,
    pub lap_time: String,
    pub personal_best: bool,
    pub time: Timestamp,
}

#[derive(Debug, ValueList)]
pub struct GapToLeader {
    pub id: Uuid,
    pub driver_nr: i16,
    pub raw: f64,
    pub human: String,
    pub time: Timestamp,
}

#[derive(Debug, ValueList)]
pub struct Sector {
    pub id: Uuid,
    pub number: i8,
    pub time: Timestamp,
}

#[derive(Debug, ValueList)]
pub struct MiniSector {
    pub id: Uuid,
    pub sector: i8,
    pub number: i8,
    pub status: i16,
    pub time: Timestamp,
}

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

// "TimingAppData": Object {"Lines": Object {"10": Object {"Stints": Object {"1": Object {"TotalLaps": Number(14)}}}}}
// "TimingAppData": Object {"Lines": Object {"10": Object {"Stints": Object {"0": Object {"LapFlags": Number(0)}, "1": Object {"LapFlags": Number(1), "LapNumber": Number(15), "LapTime": String("1:13")}
// "TimingAppData": Object {"Lines": Object {"23": Object {"Stints": Object {"1": Object {"TotalLaps": Number(10)}, "2": Object {"Compound": String("SOFT"), "LapFlags": Number(0), "New": String("false"), "StartLaps": Number(10), "TotalLaps": Number(10), "TyresNotChanged": String("1")}}}}}
// "TimingAppData": Object {"Lines": Object {"1": Object {"Stints": Object {"1": Object {"TotalLaps": Number(5)}}}, "10": Object {"Stints": Object {"2": Object {"TotalLaps": Number(7)}}}, "44": Object {"Stints": Object {"1": Object {"TotalLaps": Number(4)}}}}}

// "TopThree": Object {"Lines": Object {"1": Object {"BroadcastName": String("L SARGEANT"), "DiffToLeader": String("+0.750"), "FullName": String("Logan SARGEANT"), "LapTime": String("1:15.987"), "RacingNumber": String("2"), "Team": String("Williams"), "TeamColour": String("37BEDD"), "Tla": String("SAR")}, "2": Object {"BroadcastName": String("M VERSTAPPEN"), "FullName": String("Max VERSTAPPEN"), "RacingNumber": String("1"), "Team": String("Red Bull Racing"), "TeamColour": String("3671C6"), "Tla": String("VER")}}}

// "ExtrapolatedClock": Object {"Extrapolating": Bool(false), "Remaining": String("00:11:12"), "Utc": String("2023-05-27T14:06:49.993Z")

// "SessionData": Object {"StatusSeries": Object {"4": Object {"TrackStatus": String("Red"), "Utc": String("2023-05-27T14:06:50.384Z")}}}
// "SessionData": Object {"StatusSeries": Object {"3": Object {"SessionStatus": String("Aborted"), "Utc": String("2023-05-27T14:06:49.025Z")}}}

// "TimingStats": Object {
//     "Lines": Object {
//         "18": Object {
//             "BestSectors": Object {
//                 "1": Object {
//                     "Position": Number(15)
//                 }
//             }
//         },
//         "2": Object {
//             "BestSectors": Object {
//                 "1": Object {
//                     "Position": Number(13)
//                 }
//             }
//         },
//         "21": Object {
//             "BestSectors": Object {
//                 "1": Object {
//                     "Position": Number(14)
//                 }
//             }
//         },
//         "22": Object {
//             "BestSectors": Object {
//                 "1": Object {
//                     "Position": Number(12)
//                 }
//             }
//         },
//         "23": Object {
//             "BestSectors": Object {
//                 "1": Object {
//                     "Position": Number(11)
//                 }
//             }
//         },
//         "77": Object {
//             "BestSectors": Object {
//                 "1": Object {
//                     "Position": Number(10),
//                     "Value": String("34.965")
//                 }
//             }
//         }
//     }
// }

// "TimingStats": Object {"Lines": Object {"1": Object {"BestSectors": Object {"2": Object {"Position": Number(2)}}, "PersonalBestLapTime": Object {"Position": Number(3)}}, "10": Object {"PersonalBestLapTime": Object {"Position": Number(7)}}, "11": Object {"BestSectors": Object {"2": Object {"Position": Number(4)}}, "PersonalBestLapTime": Object {"Position": Number(4)}}, "14": Object {"PersonalBestLapTime": Object {"Position": Number(5)}}, "16": Object {"BestSectors": Object {"2": Object {"Position": Number(5)}}, "PersonalBestLapTime": Object {"Position": Number(9)}}, "18": Object {"PersonalBestLapTime": Object {"Position": Number(6)}}, "24": Object {"PersonalBestLapTime": Object {"Position": Number(2)}}, "31": Object {"PersonalBestLapTime": Object {"Position": Number(10)}}, "4": Object {"BestSectors": Object {"2": Object {"Position": Number(1), "Value": String("19.436")}}, "PersonalBestLapTime": Object {"Lap": Number(4), "Position": Number(1), "Value": String("1:13.485")}}, "77": Object {"BestSectors": Object {"2": Object {"Position": Number(3)}}, "PersonalBestLapTime": Object {"Position": Number(8)}}}}

// "TimingStats": Object {
//     "Lines": Object {
//         "20": Object {
//             "PersonalBestLapTime": Object {
//                 "Position": Number(19)
//             }
//         },
//         "24": Object {
//             "PersonalBestLapTime": Object {
//                 "Lap": Number(13),
//                 "Position": Number(16),
//                 "Value": String("1:14.575")
//             }
//         },
//         "4": Object {
//             "PersonalBestLapTime": Object {
//                 "Position": Number(17)
//             }
//         },
//         "81": Object {
//             "PersonalBestLapTime": Object {
//                 "Position": Number(18)
//             }
//         }
//     }
// }

// "TopThree": Object {
//     "Lines": Object {
//         "1": Object {
//             "LapState": Number(65)
//         }
//         "2": Object {
//             "LapState": Number(65)
//         }
//         "3": Object {
//             "LapState": Number(65)
//         }
//     }
// }

// "TrackStatus": Object {
//     "Message": String("Yellow"),
//     "Status": String("2"),
//     "_kf": Bool(true)
// }

// "TrackStatus": Object {
//     "Message": String("Red"),
//     "Status": String("5"),
//     "_kf": Bool(true)
// }

// "DriverList": Object {
//     "14": Object {
//         "Line": Number(11)
//     },
//     "2": Object {
//         "Line": Number(15)
//     },
//     "22": Object {
//         "Line": Number(12)
//     },
//     "23": Object {
//         "Line": Number(16)
//     },
//     "24": Object {
//         "Line": Number(13)
//     },
//     "27": Object {
//         "Line": Number(10)
//     },
//     "31": Object {
//         "Line": Number(8)
//     },
//     "63": Object {
//         "Line": Number(14)
//     },
//     "77": Object {
//         "Line": Number(9)
//     }
// }
