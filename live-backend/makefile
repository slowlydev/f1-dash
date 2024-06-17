include .env

wipe-tables:
		psql ${DATABASE_URL} -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; CREATE EXTENSION IF NOT EXISTS timescaledb"

migrate:
		cargo sqlx migrate run
