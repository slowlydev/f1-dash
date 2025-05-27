dev-dashboard:
	cd ./dash && yarn dev

dev-api:
	cargo r -p api

dev-live:
	cargo r -p live


run-dashboard:
	cd ./dash && yarn build && yarn start

run-api:
	cargo r -r -p api

run-live:
	cargo r -r -p live