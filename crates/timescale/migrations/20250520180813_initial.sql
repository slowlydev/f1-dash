create table timing_driver (
    time    timestamptz not null default now(),
    nr      text        not null,
    lap     integer,

    -- timing data
    gap             bigint,
    leader_gap      bigint,

    laptime         bigint,
    sector_1        bigint,
    sector_2        bigint,
    sector_3        bigint
);

create index on timing_driver (nr, time desc);
select create_hypertable('timing_driver', 'time');
select add_retention_policy('timing_driver', interval '4 hours');

create table tire_driver (
    time    timestamptz not null default now(),
    nr      text        not null,
    lap     integer,

    -- timing app data
    compound   text,
    laps       integer
);

create index on tire_driver (nr, time desc);
select create_hypertable('tire_driver', 'time');
select add_retention_policy('tire_driver', interval '4 hours');
