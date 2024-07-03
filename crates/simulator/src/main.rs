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
use tracing::{error, info};

use log;

mod server;

#[tokio::main]
async fn main() {
    log::init();

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
            sleep(Duration::from_millis(100)).await;

            match line {
                Ok(txt) => {
                    reader_tx.send(txt).unwrap();
                }
                Err(_) => {
                    error!("failed to read line");
                }
            };
        }
    });

    server::init(tx, mpsc_tx).await;
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
