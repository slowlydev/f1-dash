use std::env;

pub enum Command {
    Save,
    Replay,
}

pub fn get_command() -> Option<Command> {
    let arg = env::args().nth(1);

    match arg.as_deref() {
        Some("save") => Some(Command::Save),
        Some("replay") => Some(Command::Replay),
        _ => None,
    }
}
