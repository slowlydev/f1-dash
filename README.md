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

This project is mono-repo style. Which means it includes the frontend aswell as the backend and some extra tools for developing and testing.
I will go over every single of of them and explain them below.

The main two parts used in production are:

- `dash` (frontend)  
  displays the data served from the backend. Also know as the thing you see when you visit [f1-dash](https://f1-dash.vercel.app).

- `data` (backend)  
  Is the backend that grabs the data from f1 and sorts and formats it in a for me useable state.
  Its currently written with bun and I am planning to rewrite it in rust sometime.

Other tools used during development or testing are:

- `data-saver`  
  Connects to the f1 socket and porints out the messages it recives.
  Its written in rust. I usually use it to pipe the output into a txt file which the `data-simulator` then can use.
  Write to txt like this: `cargo run > some-name.data.txt`

- `data-simulator`  
  Reads a txt from the `data-saver` and simulates the f1 websocket. The websocket gets started on port 8000.
  Start it like this `cargo run some-name.data.txt`

## setup

Because we have multiple components u need to install follwuing things

- node
- yarn
- bun
- rsutup (cargo)

to start the whole thing do this

```bash
# note u will need 3 terminals u can't abort one command

cd dash/
yarn # install deps
yarn dev # start frontend in dev mode

cd data/
bun i # install deps
bun start # start backend

cd data-simulator/
cargo run some-name.data.txt # will install, compile and start

# note: the txt needs to be created before hand during a race to do that do this:

cd data-saver/
cargo run > some-name.data.txt # will install, compile and start
# its supid simple but it works
```

## contributing

I really appreaciate it if you want to contribute to this project. I can recommend the GitHub issues marked as "Good First Issue" to get started.
If you want to support me and make me focus more on this project, support me here by [buying me a coffee](https://www.buymeacoffee.com/slowlydev).

## notice

This project/website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V
