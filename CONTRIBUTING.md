# How to contribute

## Setup

You will need to install the following tools:

- [nvm](https://github.com/nvm-sh/nvm) (or [fnm](https://fnm.vercel.app/), [nvm-windows](https://github.com/coreybutler/nvm-windows))
- rust & cargo ([rustup](https://rustup.rs) is highly recommended)

To get started with the frontend do the following:

> [!NOTE]
> You will need multiple terminal sessions, if you want to run everything,
> you will need 4 sessions. (frontend, live backend, api backend, simulator).
> Also the following commands assume Linux, macOS or WSL. Windows commands may differ.

```bash
# Clone the repository or your fork
git clone git@github.com:slowlydev/f1-dash.git

# Go to the frontend
cd dash/

# Install the correct node version using nvm, fnm or nvm-windows
nvm install

# Enable corepack
corepack enable

# Install the package manager (yarn) with corepack
corepack install

# Install frontend dependencies
yarn

# Copy the env example and maybe adjust envs if some ports are already in use
cp .env.example .env

# To start development
yarn dev
```

Before we can use the frontend and start developing it, we need to set up the backend.
From here on we enter the Rust part, so make sure to have it installed.

```bash
cd f1-dash/

# If you haven't installed rust & cargo run the following
rustup toolchain install

# Copy the env example and maybe adjust envs if some ports are already in use
cp .env.example .env

# To start the live backend which handles the realtime part
cargo r -p live

# To start the api backend which handles the schedule
cargo r -p api
```

Now when you want to develop something where you need to simulate a running race, you can use the simulator and pass it a telemetry recording of a past race.

```bash
cd f1-dash/

# Start the simulator
cargo r -p simulator year-circuit.data.txt
```

You can find existing telemetry recordings [here](https://github.com/slowlydev/f1-dash-data-parser/releases/tag/data). If you want to record your own new sessions, here is how:

```bash
cd f1-dash/

# Start the saver and save the telemetry recording in the year-circuit.data.txt file
cargo r -p saver year-circuit.data.txt
```

> [!NOTE]
> I recommend naming the files with the ending 
> ".data.txt" as this extension is in the gitignore so you won't accidentally commit the telemetry recordings.

## Branching Convention

For branch names we use git flow style branching.

For new features follow this: `feature/the-name-of-the-feature`  
For a bugfix or refactor follow this: `bugfix/a-title-for-the-bugfix`

These feature and bugfix branches should be based off `develop` and be merged into `develop`.

## Commit Convention

For the commit message please use conventional commits:
[https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)

### A Quick TL;DR; Of Conventional Commits

- `feat` When adding a new feature
- `fix` When fixing something
- `refactor` When it's neither a fix or a new feature
- `perf` If the change improves performance
- `chore` Anything else (should be last resort)

## Before opening a Pull Request

Please test your code, build the parts of the application you touched. For example, if you made changes in the frontend, make sure to run `yarn build` and see if the build succeeds and maybe check out how it will look in prod via `yarn start`. Sometimes there is a difference between running `dev` and `start` & `build`.

Make sure you format the files you created or touched. We use prettier for formatting, so either run the command `yarn run prettier` or install the fitting extension for your preferred IDE.

When opening a Pull Request please select `develop` as the target branch.