# How to contribute

## Setup

You will need to install following tools:

- [node](https://nodejs.org/en) (preferably 21) ([nvm](https://github.com/nvm-sh/nvm) is recommended)
- [yarn](https://yarnpkg.com/getting-started/install) (v1, not the new one) (using [corepack](https://yarnpkg.com/corepack) is recommended)
- rust & cargo ([rustup](https://rustup.rs) is highly recommended)

To get started with the frontend do the following

> [!NOTE]
> You will need multiple terminal sessions, if you want to run everything,
> you will need 4 sessions. (frontend, live backend, api backend, simulator)

```bash
# clone the repository or your fork
git clone git@github.com:slowlydev/f1-dash.git

# go to the frontend
cd dash/

# if you are using corepack run the following
corepack enable

# install frontend dependencies
yarn

# copy the env example and maybe adjust envs if some ports are already in use
cp .env.example .env

# to start development
yarn dev
```

Before we can use frontend and start developing it, we need to setup the backend.
From here on now we enter the rust part so make sure to have it installed.

```bash
cd f1-dash/

# if you haven't installed rust & cargo run the following
rustup toolchain install

# copy the env example and maybe adjust envs if some ports are already in use
cp .env.example .env

# to start the live backend which handles the realtime part
cargo r -p live

# to start the api backend which handles the schedule
cargo r -p api
```

Now when you want to develop something where u need to simulate a running race you can use the simulator and pass it a recording of a past race.

```bash
cd f1-dash/

# start the simulator
cargo r -p simulator year-circuit.data.txt
```

You can find existing recordings [here](https://github.com/slowlydev/f1-dash-data-parser/releases/tag/data). If you want to record your own new sessions heres is how:

```bash
cd f1-dash/

# start the saver and save the recording in the year-circuit.data.txt file
cargo r -p saver year-circuit.data.txt
```

> [!NOTE]
> I recommend to name the files with the ending
> ".data.txt" is in the gitignore you cant accidentally commit the recordings

## Branching Convention

For branch names we use git flow style branching.

For new features follow this: `feature/the-name-of-the-feature`
For a bugfix or refactor follow this: `bugfix/a-title-for-the-bugfix`

## Commit Convetion

For the commit message please use conventional commits:
https://www.conventionalcommits.org/en/v1.0.0/

### A Quick TL;DR; Of Conventional Commits

- `feat` When adding a new feature
- `fix` When fixing something
- `refactor` When its neither a fix or a new feature
- `perf` If the change improves performance: perf
- `chore` Anything else (should be last resort)

## Before opening a Pull Request

Please test your code, build the parts of the application you touched, for example if you made changes in the frontend, make sure to run `yarn build` and see if the build succeeds and maybe check out how it will look in prod via `yarn start` sometimes there is a difference between running `dev` and `start & build`.

Make sure you format the files you created or touched, we use prettier for formatting so either run the command `yarn run prettier` or install the fitting extension for your preferred IDE.
