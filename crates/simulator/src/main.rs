use std::{
    env,
    fs::File,
    io::{self, BufRead},
    path::Path,
    time::Duration,
};

use tokio::{
    sync::{broadcast, mpsc},
    time::sleep,
};
use tracing::{error, info, level_filters::LevelFilter};

mod server;

#[tokio::main]
async fn main() {
    init_logs();

    let interval_ms: u64 = match env::args().nth(2) {
        Some(interval_str) => match interval_str.parse() {
            Ok(interval) => interval,
            Err(_) => {
                error!("failed to parse interval, using default of 100ms");
                100
            }
        },
        None => 100,
    };

    let path = match env::args().nth(1) {
        Some(path) => path,
        None => {
            error!(r#"no path provided, usage "simulator <path>""#);
            return;
        }
    };

    let path = std::path::Path::new(&path);

    if !path.exists() {
        error!("file does not exist at path {}", path.display());
        return;
    }

    info!("serving file at path {}", path.display());

    let lines = match read_lines(path) {
        Ok(lines) => lines,
        Err(_) => {
            error!("failed to read file at path {}", path.display());
            return;
        }
    };

    let (tx, _rx) = broadcast::channel::<String>(10);
    let (mpsc_tx, mut mpsc_rx) = mpsc::channel::<()>(10);

    let reader_tx = tx.clone();

    info!("starting reader thread");

    tokio::task::spawn(async move {
        mpsc_rx.recv().await;

        info!("reader has started broadcasting lines");

        for line in lines {
            sleep(Duration::from_millis(interval_ms)).await;

            match line {
                Ok(txt) => {
                    reader_tx.send(txt).unwrap();
                }
                Err(_) => {
                    error!("failed to read line");
                }
            };
        }

        info!("reader has finished broadcasting lines")
    });

    server::init(tx, mpsc_tx).await;
}

fn init_logs() {
    let env_filter = tracing_subscriber::EnvFilter::builder()
        .with_default_directive(LevelFilter::INFO.into())
        .with_env_var("RUST_LOG")
        .from_env_lossy();

    tracing_subscriber::fmt().with_env_filter(env_filter).init();
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
