CREATE TABLE IF NOT EXISTS updates(
    id serial,
    category text NOT NULL,
    state json NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON updates(category, created_at);

-- TODO write indexes for gap leader, gap ahead, laptime, sector times, weather
