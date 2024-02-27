CREATE TABLE IF NOT EXISTS session_info(
    id serial,
    key int8,
    kind text,
    name text,
    start_date text,
    end_date text,
    gmt_offset text,
    path text,
    number int8,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('session_info', by_range('created_at'));

SELECT
    add_retention_policy('session_info', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS track_status(
    id serial,
    status text,
    message text,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('track_status', by_range('created_at'));

SELECT
    add_retention_policy('track_status', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS meeting(
    id serial,
    key text,
    name text,
    official_name text,
    location text,
    country_key text,
    country_code text,
    country_name text,
    circuit_key int8,
    circuit_name text,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('meeting', by_range('created_at'));

SELECT
    add_retention_policy('meeting', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS lap_count(
    id serial,
    current int8,
    total int8,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('lap_count', by_range('created_at'));

SELECT
    add_retention_policy('lap_count', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS weather(
    id serial,
    humidity float8,
    pressure float8,
    rainfall bool,
    wind_direction int8,
    wind_speed float8,
    air_temp float8,
    track_temp float8,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('weather', by_range('created_at'));

SELECT
    add_retention_policy('weather', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS race_control_messages(
    id serial,
    utc text,
    lap int8,
    message text,
    category text,
    flag text,
    scope text,
    sector text,
    drs_enabled text,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('race_control_messages', by_range('created_at'));

SELECT
    add_retention_policy('race_control_messages', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS team_radio(
    id serial,
    utc text,
    driver_nr text,
    url text,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('team_radio', by_range('created_at'));

SELECT
    add_retention_policy('team_radio', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS general_timing(
    id serial,
    no_entries int8[],
    session_part smallint,
    cut_off_time text,
    cut_off_percentage text,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('general_timing', by_range('created_at'));

SELECT
    add_retention_policy('general_timing', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver(
    id serial,
    driver_nr text NOT NULL,
    full_name text,
    first_name text,
    last_name text,
    short text,
    country text,
    line int8,
    team_name text,
    team_color text,
    picture text,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('driver', by_range('created_at'));

SELECT
    add_retention_policy('driver', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver_timing(
    id serial,
    driver_nr text NOT NULL,
    line text,
    position text,
    show_position bool,
    gap_to_leader int8,
    gap_to_ahead int8,
    gap_to_leader_laps int8,
    gap_to_ahead_laps int8,
    catching_ahead bool,
    lap_time int8,
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

SELECT
    create_hypertable('driver_timing', by_range('created_at'));

SELECT
    add_retention_policy('driver_timing', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver_sector(
    id serial,
    driver_nr text NOT NULL,
    number int8 NOT NULL,
    time int8,
    previous_time int8,
    status int8,
    stopped bool,
    overall_fastest bool,
    personal_fastest bool,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('driver_sector', by_range('created_at'));

SELECT
    add_retention_policy('driver_sector', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver_sector_segment(
    id serial,
    driver_nr text NOT NULL,
    sector_number int8 NOT NULL,
    number int8 NOT NULL,
    status int8,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('driver_sector_segment', by_range('created_at'));

SELECT
    add_retention_policy('driver_sector_segment', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver_stints(
    id serial,
    driver_nr text NOT NULL,
    stint_nr int8 NOT NULL,
    lap_flags int8,
    compound text,
    new bool,
    tires_not_changed bool,
    total_laps int8,
    start_laps int8,
    lap_time int8,
    lap_number int8,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('driver_stints', by_range('created_at'));

SELECT
    add_retention_policy('driver_stints', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver_speeds(
    id serial,
    driver_nr text NOT NULL,
    station text NOT NULL,
    value int8,
    status int8,
    overall_fastest bool,
    personal_fastest bool,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('driver_speeds', by_range('created_at'));

SELECT
    add_retention_policy('driver_speeds', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver_stats(
    id serial,
    driver_nr text NOT NULL,
    lap int8,
    pb_lap_time int8,
    pb_lap_time_pos int8,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('driver_stats', by_range('created_at'));

SELECT
    add_retention_policy('driver_stats', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver_sector_stats(
    id serial,
    driver_nr text NOT NULL,
    number int8 NOT NULL,
    value int8,
    position int8,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('driver_sector_stats', by_range('created_at'));

SELECT
    add_retention_policy('driver_sector_stats', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver_position(
    id serial,
    driver_nr text NOT NULL,
    timestamp text NOT NULL,
    status text NOT NULL,
    x float8 NOT NULL,
    y float8 NOT NULL,
    z float8 NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('driver_position', by_range('created_at'));

SELECT
    add_retention_policy('driver_position', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS driver_car_data(
    id serial,
    driver_nr text NOT NULL,
    timestamp text,
    rpm float8,
    speed float8,
    gear int8,
    throttle int8,
    breaks bool,
    drs bool,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('driver_car_data', by_range('created_at'));

SELECT
    add_retention_policy('driver_car_data', INTERVAL '4 hours');

CREATE TABLE IF NOT EXISTS extrapolated_clock(
    id serial,
    extrapolating bool,
    remaining text,
    utc text,
    created_at timestamptz NOT NULL DEFAULT now()
);

SELECT
    create_hypertable('extrapolated_clock', by_range('created_at'));

SELECT
    add_retention_policy('extrapolated_clock', INTERVAL '4 hours');
