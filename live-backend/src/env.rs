pub fn init() {
    // we cant use info and warn here yet
    // because we load envs before log levels because log levels are set by envs
    match dotenvy::dotenv() {
        Ok(_) => println!("successfully found env file and loaded vars"),
        Err(_) => println!("no env file found"),
    }
}
