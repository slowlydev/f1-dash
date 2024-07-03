use std::{
    env,
    fs::File,
    io::{self, BufRead},
    path::Path,
    thread,
    time::Duration,
};

use tokio::sync::broadcast;
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
        error!("file does not exisit at path {}", path.display());
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

    let reader_tx = tx.clone();

    info!("starting reader thread");

    thread::spawn(move || {
        for line in lines {
            thread::sleep(Duration::from_millis(100));

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

    server::init(tx).await;
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
