use std::path::Path;

use anyhow::Error;

use crate::commands::get_command;

mod commands;
mod replay;
mod save;

#[tokio::main]
async fn main() -> Result<(), Error> {
    shared::tracing_subscriber();

    let command = get_command()
        .ok_or_else(|| anyhow::anyhow!("No command provided. Use 'save' or 'replay'."))?;

    let path = std::env::args()
        .nth(2)
        .ok_or_else(|| anyhow::anyhow!("No path provided. Usage: <command> <path>"))?;

    let path = Path::new(&path);

    match command {
        commands::Command::Save => save::save(path).await?,
        commands::Command::Replay => replay::replay(path).await?,
    }

    Ok(())
}
