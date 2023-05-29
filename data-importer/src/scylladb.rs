use scylla::{transport::errors::NewSessionError, Session, SessionBuilder};

pub async fn connect() -> Result<Session, NewSessionError> {
    let uri = std::env::var("SCYLLA_URI").unwrap_or_else(|_| "127.0.0.1:9042".to_string());
    SessionBuilder::new().known_node(uri).build().await
}

pub async fn setup(session: &Session) {
    session.query("CREATE KEYSPACE IF NOT EXISTS f1_dash WITH REPLICATION = {'class' : 'SimpleStrategy', 'replication_factor' : 1}", &[]).await.err();

    // session
    //     .query(
    //         "CREATE TABLE IF NOT EXISTS f1_dash.weekend (
    //             id uuid,
    //             name text,
    //             official_name text,
    //             year text,
    //             PRIMARY KEY (id)
    //         )",
    //         &[],
    //     )
    //     .await
    //     .err();

    // session
    //     .query(
    //         "CREATE TABLE IF NOT EXISTS f1_dash.session (
    //             id uuid,
    //             weekend uuid,
    //             name text,
    //             type text,
    //             start_date timestamp,
    //             end_date timestamp,
    //             PRIMARY KEY (weekend)
    //         )",
    //         &[],
    //     )
    //     .await
    //     .err();

    session
        .query(
            "CREATE TABLE IF NOT EXISTS f1_dash.weather (
                    id uuid,
                    humidity double,
                    pressure double,
                    rainfall smallint,
                    wind_direction smallint,
                    wind_speed double,
                    air_temp double,
                    track_temp double,
                    time timestamp,
                    PRIMARY KEY (id, time)
                ) WITH CLUSTERING ORDER BY (time ASC)",
            &[],
        )
        .await
        .err();

    session
        .query(
            "CREATE TABLE IF NOT EXISTS f1_dash.race_control_messages (
                id uuid,
                message text,
                time timestamp,
                PRIMARY KEY (id, time)
            ) WITH CLUSTERING ORDER BY (time ASC)",
            &[],
        )
        .await
        .err();

    session
        .query(
            "CREATE TABLE IF NOT EXISTS f1_dash.last_lap_time (
                id uuid,
                driver_nr smallint,
                lap_time text,
                personal_best boolean,
                time timestamp,
                PRIMARY KEY (id, time)
            ) WITH CLUSTERING ORDER BY (time ASC)",
            &[],
        )
        .await
        .err();

    session
        .query(
            "CREATE TABLE IF NOT EXISTS f1_dash.gap_to_leader (
                id uuid,
                driver_nr smallint,
                raw double,
                human text,
                time timestamp,
                PRIMARY KEY (id, time)
            ) WITH CLUSTERING ORDER BY (time ASC)",
            &[],
        )
        .await
        .err();
}
