use std::sync::{Arc, Mutex};

mod history;
mod merge;
mod parser;

fn main() {
    // setup history
    let history: Arc<Mutex<history::History>> = Arc::new(Mutex::new(history::History::new()));

    // handle new messages for histoy

    // setup f1 connetion and send to history

    // start ws server

    // handle connections
}
