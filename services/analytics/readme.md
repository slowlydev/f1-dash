# analytics

saves live timing data in a timeseries database and provides analytics of said data

## usage

```bash
cargo r -p analytics
```

you can set the port, address and log level with these env vars

```bash
# the address and port where it starts
ANALYTICS_BACKEND_ADDRESS=localhost:4002

# sets the rust log level
RUST_LOG="api=debug,info"
```
