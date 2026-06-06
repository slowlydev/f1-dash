use std::{
    fs::File,
    io::{BufRead, BufReader},
    path::Path,
};

use anyhow::Error;

mod server;

pub async fn replay(path: &Path) -> Result<(), Error> {
    if !path.exists() {
        return Err(anyhow::anyhow!(
            "File does not exist at path {}",
            path.display()
        ));
    }

    let file = File::open(path)?;

    let buffer = BufReader::new(file);

    let lines = buffer
        .lines()
        .filter_map(|line| line.ok())
        .collect::<Vec<String>>();

    server::run(lines).await
}
