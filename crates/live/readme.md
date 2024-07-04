# live

connects to the f1 singalr websocket endpoint or the simulator and maintains the full current state.
also spins up a http server with a SSE endpoint where initially the maintained full state gets sent and then the partial updates get forwarded

## usage

```bash
cargo r -p live
```

you can set the port and address, origin and log level and websocket url with these env vars

```bash
# the address and port where it starts
LIVE_BACKEND_ADDRESS=localhost:4000

# the origin for CORS
ORIGIN=http://localhost:3000

# sets the rust log level
RUST_LOG="live=debug,info"
```
