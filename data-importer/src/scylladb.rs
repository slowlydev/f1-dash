use scylla::{transport::errors::NewSessionError, Session, SessionBuilder};

pub async fn connect() -> Result<Session, NewSessionError> {
    let uri = std::env::var("SCYLLA_URI").unwrap_or_else(|_| "127.0.0.1:9042".to_string());
    SessionBuilder::new().known_node(uri).build().await
}

pub async fn setup(session: &Session) {
    session.query("CREATE KEYSPACE IF NOT EXISTS f1_dash WITH REPLICATION = {'class' : 'SimpleStrategy', 'replication_factor' : 1}", &[]).await.err();

    session
        .query(
            "CREATE TABLE IF NOT EXISTS f1_dash.weather (
                    id uuid,
                    humidity double,
                    pressure double,
                    rainfall double,
                    wind_direction smallint,
                    wind_speed double,
                    air_temp double,
                    track_temp double,
                    time text,
                    primary key (id)
                )",
            &[],
        )
        .await
        .err();

    session
        .query(
            "CREATE TABLE IF NOT EXISTS f1_dash.race_control_messages (
                id uuid,
                message text,
                time text,
                primary key (id)
            )",
            &[],
        )
        .await
        .err();

    session
        .query(
            "CREATE TABLE IF NOT EXISTS f1_dash.last_lap_time (
                id uuid,
                lap_time text,
                personal_best boolean,
                time text,
                primary key (id)
            )",
            &[],
        )
        .await
        .err();
}
