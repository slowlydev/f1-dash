# f1-dash

A real-time F1 dashboard that shows the leader board, tires, gaps, laps, mini sectors and much more

## dash (frontend)

displays the data served from the backend

`yarn` install dependencies  
`yarn dev` start in dev mode  
`yarn build` build app  
`yarn start` start builded app

## data (backend)

on connection start grabbing data from f1, reformats it and sends it to the dashboard

`bun i` install dependencies  
`bun start` start in backend

## data-saver (backend)

connects to f1 and writes the received raw data into a txt for the simulator to read and use (used for testing)

`cargo run` install dependencies & start program  
`cargo build` install dependencies & build program

## data-simulator (backend)

reads a txt and simulates the f1 websocket (used for testing)

`cargo run` install dependencies & start program  
`cargo build` install dependencies & build program

## planned data flow

```
f1 > data > dash
```

Other versions (none working right now):

```
f1 > data-tunnel > dash
```

```
f1 > data-provider > scylladb > data > dash
```

```
data-simulator > data-provider > scylladb > data > dash
```

## servers

Dashboard Frontend:
http://localhost:3000/

Data Backend:
http://localhost:4000/

ScyllaDB:
http://localhost:9042/

Data Simulator:
http://localhost:8000/

## important api stuff

https://api.formula1.com/v1/event-tracker
https://livetiming.formula1.com/static/SessionInfo.json
https://livetiming.formula1.com/static/StreamingStatus.json
https://www.reddit.com/r/formula1/comments/b4t3q7/where_does_f1tfeednet_get_their_data/
https://github.com/marcokreeft87/formulaone-card
