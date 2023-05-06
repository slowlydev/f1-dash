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

## important events

{"C":"d-25125E9D-B,0|RmG,0|RmH,11|d,2D9|Bf,2546|Bk,258A|a,6|Y,95|CC,0|Bq,660|W,4C7|c,A3|BY,15|X,EA|Bl,43|Bn,3|Bm,22|Z,0|Bp,7062","M":[{"A":["SessionData",{"StatusSeries":{"17":{"SessionStatus":"Finalised","Utc":"2023-05-05T22:36:43.299Z"}}},"2023-05-05T22:36:43.299Z"],"H":"Streaming","M":"feed"}]}
