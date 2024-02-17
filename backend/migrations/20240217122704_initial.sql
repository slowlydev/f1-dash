-- Add migration script here
CREATE TABLE IF NOT EXISTS session_status(
    id serial PRIMARY KEY,
    utc text,
    track_status text,
    session_status text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lap_count(
    id serial PRIMARY KEY,
    current text,
    total text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS weather(
    id serial PRIMARY KEY,
    humidity text,
    pressure text,
    rainfall text,
    wind_direction text,
    wind_speed text,
    air_temp text,
    track_temp text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS race_control_messages(
    id serial PRIMARY KEY,
    utc text,
    lap text,
    message text,
    category text,
    flag text,
    scope text,
    sector text,
    drs_enabled text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_radio(
    id serial PRIMARY KEY,
    utc text,
    driver_nr text,
    url text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS general_timing(
    id serial PRIMARY KEY,
    no_entries text[],
    session_part smallint,
    cut_off_time text,
    cut_off_percentage text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver(
    id serial PRIMARY KEY,
    driver_nr text,
    full_name text,
    first_name text,
    last_name text,
    short text,
    country text,
    line text,
    team_name text,
    team_color text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_timing(
    id serial PRIMARY KEY,
    driver_nr text,
    line text,
    position text,
    show_position bool,
    gap_to_leader text,
    gap_to_ahead text,
    catching_ahead bool,
    lap_time text,
    lap_time_fastest bool,
    lap_time_pb bool,
    number_of_laps int8,
    number_of_pit_stops int8,
    status int8,
    retired bool,
    in_pit bool,
    pit_out bool,
    knocked_out bool,
    stopped bool,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_sector(
    id serial PRIMARY KEY,
    driver_nr text,
    number int8,
    time text,
    previous_time text,
    status int8,
    stopped bool,
    overall_fastest bool,
    personal_fastest bool,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_sector_segment(
    id serial PRIMARY KEY,
    driver_nr text,
    sector_number int8,
    number int8,
    status int8,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_speeds(
    id serial PRIMARY KEY,
    driver_nr text,
    station text,
    value text,
    status int8,
    overall_fastest bool,
    personal_fastest bool,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_stats(
    id serial PRIMARY KEY,
    driver_nr text,
    pb_lap_time text,
    pb_lap_time_pos int8,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_sector_stats(
    id serial PRIMARY KEY,
    driver_nr text,
    number int8,
    value text,
    position int8,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_position(
    id serial PRIMARY KEY,
    driver_nr text,
    timestamp text,
    status text,
    x float8,
    y float8,
    z float8,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_car_data(
    id serial PRIMARY KEY,
    driver_nr text,
    timestamp text,
    rpm float8,
    speed float8,
    gear int8,
    throttle int8,
    breaks bool,
    drs bool,
    created_at timestamptz NOT NULL DEFAULT now()
);

