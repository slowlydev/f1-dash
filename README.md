<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./dash/public/tag-logo.png" width="200">
    <img alt="f1-dash" src="./dash/public/tag-logo.png" width="200">
  </picture>
</p>

<h1 align="center">Real-time Formula 1 telemetry and timing</h1>

## f1-dash

A real-time F1 dashboard that shows the leader board, tires, gaps, laps, mini sectors and much more

## project structure

This project is mono-repo style. Which means it includes the frontend as well as the backends and some extra tools for developing and testing.

- `dash` (frontend)
  displays the data served from the backend. Also know as the thing you see when you visit [f1-dash](https://f1-dash.com).

- `live-backend` (backend)
  gets the data from formula 1, stores it in a postgres database and sends it to the connected clients. See [`live-backend/readme.md`](./live-backend/readme.md) for more info

- `api-backend` (backend)
  currently only provides data of the full schedule and next round

Other tools used during development or testing are:

- `data-saver`
  Connects to the f1 socket and prints out the messages it receives.
  Its written in rust. I usually use it to pipe the output into a txt file which the `data-simulator` then can use.
  Write to txt like this: `cargo run > some-name.data.txt`

- `data-simulator`
  Reads a txt from the `data-saver` and simulates the f1 websocket. The websocket gets started on port 8000.
  Start it like this `cargo run some-name.data.txt`

## setup

Because we have multiple components you need to install following things

- node
- yarn
- rustup (cargo)

to start the whole thing do this

```bash
cd dash/
yarn
yarn dev

cd api-backend/
cargo run

cd live-backend/
cargo run
```

## contributing

I really appreciate it if you want to contribute to this project. I can recommend the GitHub issues marked as "Good First Issue" to get started.
If you want to support me and make me focus more on this project, support me here by [buying me a coffee](https://www.buymeacoffee.com/slowlydev).

## notice

This project/website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V
