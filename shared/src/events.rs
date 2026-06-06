use crate::models::State;

pub enum Event {
    Update(Topic),
    Init { state: State, utc: u64 },
}

pub enum Topic {
    Session {},
    Timing,
    Drivers,
    Sectors,
    CarPositions,
    CarTelemetry,
    RadioMessages,
    RaceControlMessages,
}
