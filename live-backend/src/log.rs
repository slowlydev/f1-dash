use tracing::level_filters::LevelFilter;

pub fn init() {
    let env_filter = tracing_subscriber::EnvFilter::builder()
        .with_default_directive(LevelFilter::INFO.into())
        .with_env_var("RUST_LOG")
        .from_env_lossy();

    tracing_subscriber::fmt().with_env_filter(env_filter).init();
}
