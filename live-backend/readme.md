# f1-dash backend

## what does it do

it connects to the f1 api websocket and keeps track of the full current state which gets saved every 1s in a timescale db.

on new sse conenctions it sends the current full state and then forwards the updates of the f1 websocket to the connected clients.

## stack

- tokio
- tracing
- axum
- sqlx
- serde

and more... I suggest check `Cargo.toml`

## setup

you will need a timescale db

you will need cargo, you can install it with for example cargo.

you will need to copy the env example and adjust it when needed

```bash
cp example.env .env
```

to build and then run

```bash
cargo build --release
./target/release/live-backend
```

## modules

`main.rs` - init all modules, create current state, start client, keeper and server.

`server.rs` - start axum with all endpoints

- `cors.rs` - utility to create a CorsLayer for axum
- `health.rs` - a health endpoint for the backend
- `history.rs` - query database for the history of a single driver
- `live.rs` - SSE endpoint which forwards formatted f1 initial state and updates
- `recap.rs` - send db entries from the keeper with a start and end date.

`client.rs` - connect and setup f1 web socket, parse messages, filter unused messages send messages to broadcast channel.

- `messages.rs` - handles the formatting and restructuring for outgoing messages.
- `consts.rs` - contains consts for the interaction with the F1 SingalR WebSocket

`data` - utilities to work with f1-dash and f1 data

- `compression` - deflates outgoing SSE events to save bandwith
- `merge` - here to merge updates into current state
- `transformer` - transforms f1's `PascalCase` json to `camelCase`

`env.rs` - read `.env` files and set env variables for further use

`log.rs` - initialize tracing subscriber and read log level from `RUST_LOG` env var.

`db.rs` - initialize a pool of postgres database connections using `DATABASE_URL` env.
