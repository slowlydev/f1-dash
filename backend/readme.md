# f1-dash backend

## APIs exposed to frontend

- `partial update request`
- `base state request`
- `partial updates (realtime)`

## How do we provide those?

- `partial update request`  
  we store each partial update in our DB when reciving them, we retrive some of them on request
- `base state request`  
  we get a timestamp and compute a base state. either from the R state or from requested time until all fields are filled.
- `partial updates`  
  transform the partial updates from f1 and send them directly

## How do we transform this?

We write a transform for each catagory.
This is 'best-effort' as they are partial, if someting is missing, we send it missing

- `ExtrapolatedClock`

  - utc
  - remaining
  - extraploating

- `SessionStatus` `* array`

  - utc
  - track_status
  - session_status

- `TrackStatus`

  - status
  - status_message

- `LapCount`

  - current
  - total

- `WeatherData`

  - humidity
  - pressure
  - rainfall
  - wind_direction
  - wind_speed
  - air_temp
  - track_temp

- `RaceControlMessages` `* array`

  - utc
  - lap
  - message
  - catagory
  - flag
  - scope
  - sector
  - drs_enabled

- `TeamRadio` `* array`

  - driver_nr
  - utc
  - audio_url

- `Drivers`

  - driver_nr
  - full_name
  - first_name
  - last_name
  - short
  - country
  - line
  - team_name
  - team_color

- `DriverTiming`

  - retired
  - pit
  - pit_out
  - stopped
  - cutoff
  - knocked_out
  - status `* check`
  - sectors `* nested!`
  - speeds `* nested!`
  - laptime_best `* nested!`
  - laptime_last `* nested!`
  - laps `* check`

- `SessionInfo`

  - meeting
  - lap
  - message
  - catagory
  - flag
  - scope
  - sector
  - drs_enabled
