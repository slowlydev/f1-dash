# API

Parses an iCal file and returns JSON for the current F1 season schedule.

## Usage

```bash
cargo r -p api
```

You can set the port, address and log level with these env vars:

```bash
# The address and port where it starts
API_BACKEND_ADDRESS=localhost:4001

# Sets the rust log level
RUST_LOG="api=debug,info"
```