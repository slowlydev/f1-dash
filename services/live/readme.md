# Live

Connects to the F1 SignalR websocket endpoint or the simulator and maintains the full current state.
Also spins up a HTTP server with a SSE endpoint where initially the maintained full state gets sent and then the partial updates get forwarded.

## Usage

```bash
cargo r -p live
```

You can set the port and address, origin and log level and websocket URL with these env vars:

```bash
# The address and port where it starts
LIVE_BACKEND_ADDRESS=localhost:4000

# The origin for CORS
ORIGIN=http://localhost:3000

# Sets the rust log level
RUST_LOG="live=debug,info"
```