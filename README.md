# f1-dash

```
f1 > [ signalrs ] > ScyllaDB > [ trpc > frontend ]
```

```
f1 > [ signalrs ] > websocket > [ frontend ]
```

```
f1 > signalrs > scylla-rust-driver > ScyllaDB  > scylla-rust-driver > sse > frontend
```

## servers

Dashboard Frontend:
http://localhost:3000/

Data Backend:
http://localhost:4000/

ScyllaDB
http://localhost:9042/

## backend flow

start backend

start SingalR client and listen for events

on SingalR event write to DB

if open sse session send event to frontend

## important api stuff

https://livetiming.formula1.com/static/SessionInfo.json
https://livetiming.formula1.com/static/StreamingStatus.json
https://www.reddit.com/r/formula1/comments/b4t3q7/where_does_f1tfeednet_get_their_data/
