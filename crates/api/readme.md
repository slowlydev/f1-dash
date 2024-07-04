# api

parses an ical file and returns json for the current f1 season schedule

## usage

```bash
cargo r -p api
```

you can set the port, address and log level with these env vars

```bash
# the address and port where it starts
API_BACKEND_ADDRESS=localhost:4001

# sets the rust log level
RUST_LOG="api=debug,info"
```
