# How to contribute

## Setup the project

Because we have multiple components u need to install following things

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

## Branching Convention

For branch names we use git flow style branching.

For new features follow this: `feature/the-name-of-the-feature`
For a bugfix or refactor follow this: `bugfix/a-title-for-the-bugfix`

## Commit Convetion

For the commit message please use conventional commits:
https://www.conventionalcommits.org/en/v1.0.0/

### a quick tldr of conventional commits
When adding a new feature: feat
When fixing something: fix
When its neither a fix or a new feature: refactor
If the change improves performance: perf
Anything else (should be last resort): chore
