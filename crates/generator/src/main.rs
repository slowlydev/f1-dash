use std::{fs, path::Path};

use generator::{generate_replay, select_meeting, select_session, select_year_index};
use inquire::{Confirm, Text};

fn to_kebab_case(string: &String) -> String {
    let mut res = String::new();
    for char in string.chars() {
        res.push(if char == ' ' {
            '-'
        } else {
            char.to_ascii_lowercase()
        });
    }
    res
}

fn try_to_absolute(path: &Path) -> String {
    std::path::absolute(path)
        .unwrap_or(path.to_path_buf())
        .display()
        .to_string()
}

fn select_output_path(default: String) -> Box<Path> {
    loop {
        let file_name = Text::new("Output path:")
            .with_default(&default)
            .with_formatter(&|name| try_to_absolute(std::path::Path::new(name)))
            .prompt()
            .expect("Failed to read input");
        let path = std::path::Path::new(&file_name);
        if path.exists() {
            let confirm = Confirm::new(&format!(
                "File already exists at path {}. Replace it?",
                path.display()
            ))
            .with_default(true)
            .prompt()
            .expect("Failed to read input");
            if !confirm {
                continue;
            }
        }
        return path.into();
    }
}

fn main() {
    let year_index = select_year_index();
    let meeting = select_meeting(&year_index.meetings).expect("Failed to read input");
    let session = select_session(&meeting.sessions).expect("Failed to read input");
    let path = select_output_path(format!(
        "{}-{}-{}.data.txt",
        &year_index.year,
        to_kebab_case(&meeting.country.name),
        to_kebab_case(&session.name)
    ));

    let replay = generate_replay(&session, true);

    fs::write(&path, replay).expect("Failed to write to file");

    println!("Replay created at {}", try_to_absolute(&path));
}
