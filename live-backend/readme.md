# f1-dash backend

## what does it do

it connects to the f1 api websocket and stores all data into a postgres db.
it also transforms the data and sends it to clients.
it also allows requesting data or state older than the connection the client has.
which is useful for graphs and history of values and allowing for delayed timing data.

## stack

- sqlx
- serde
- tracing
- tokio
- tokio-tungstenite

and more... I suggest check `Cargo.toml`

## setup

you will need a postgres db, you might want to use the postgres docker compose directory found in the project root.
to setup install `sqlx` cli and run the migrations.

you will need cargo, you can install it with for example cargo.

you will need to copy the env example and adjust it when needed

```bash
cp example.env .env
```

to build and then run

```bash
cargo build --release
./target/release/backend
```

## modules

`env.rs` - read `.env` files and set env variables for further use

`log.rs` - initialize tracing subscriber and read log level from `LOG_LEVEL` env var.

`db.rs` - initialize a pool of postgres database connections using `DATABASE_URL` env.

`server.rs` - initialize the websocket server and forward broadcast messages to client and use broadcast.

`broadcast.rs` - handle requests from `server` to `odctrl` and `rdctrl` and sends that to all client from `odctrl` and `rdctrl`

`client.rs` - connect and setup f1 web socket, parse messages, filter unused messages, provide subscription for messages.

`messages.rs` - handles the formatting and restructuring for outgoing messages.

`main.rs` - initialize and run all modules needed, has all mpsc channels.

`data/odctrl.rs` - "old data control" handles client requests for old updates and handles reconstruction of initial states for new connections.

- `merge` - merge JSON together, opinionated and optimized for f1 data
- `query` - query old updates stored in the database
- `recon` - reconstruct a initial value for late connections and delayed state (planned feature)

`data/rdctrl.rs` - "realtime data control" receives messages from client and transforms them ASAP sends initial state to `odctrl` and utilizes the `keeper` to save all messages into the DB

- `inflate` - currently unused
- `keeper` - saves updates into the database
- `transformer` - transforms json into camelCase
