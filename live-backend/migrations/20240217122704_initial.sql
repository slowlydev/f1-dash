create table if not exists state(
    time timestamptz not null,
    state jsonb NOT NULL
);

create index on state (time);

select create_hypertable('state', by_range('time'));

select add_retention_policy('state', INTERVAL '4 hours');
