# SignalR Client

A shared SignalR client library for connecting to F1's live timing SignalR endpoint.

## Overview

This crate provides a reusable SignalR client that handles:

- Negotiation with the SignalR endpoint
- WebSocket connection establishment
- Topic subscription
- Message streaming (both parsed and raw formats)

## Usage

### Creating a client and subscribing to topics

```rust
use signalr::{create_client, subscribe, listen};

const URL: &str = "livetiming.formula1.com/signalr";
const HUB: &str = "Streaming";

let mut client = create_client(URL, HUB).await?;

let topics = &["Heartbeat", "TimingData", "DriverList"];
let initial_state = subscribe(&mut client, topics).await?;

// Process updates
let mut stream = listen(client);
while let Some(updates) = stream.next().await {
    for update in updates {
        println!("Topic: {}, Data: {}", update.topic, update.data);
    }
}
```

### Listening to raw messages (for recording/saving)

```rust
use signalr::{create_client, subscribe, listen_raw};

let mut client = create_client(URL, HUB).await?;
let _ = subscribe(&mut client, topics).await?;

// Get raw WebSocket messages as strings
let mut stream = listen_raw(client);
while let Some(raw_message) = stream.next().await {
    // Write raw JSON to file for later replay
    writeln!(file, "{}", raw_message)?;
}
```

## Functions

- `create_client(url, hub)` - Establishes a SignalR WebSocket connection
- `subscribe(client, topics)` - Subscribes to specified topics, returns initial state
- `listen(client)` - Returns a stream of parsed `UpdateArgs` structs
- `listen_raw(client)` - Returns a stream of raw JSON strings

## Environment Variables

- `F1_DEV_URL` - Override the WebSocket URL for development/testing