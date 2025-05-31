# Docker and Docker Compose

> [!NOTE]
> The docker compose is not meant as a production deployment rather a tool to setup f1-dash locally for testing or development.
> If you want to deploy f1-dash, it can be used as a base but

To substitute the environment variables in compose.yaml, use `--env-file` flag as follows:

```bash
docker compose --env-file ./compose.env up
# or
docker compose --env-file ./compose.env build
# or
docker compose --env-file ./compose.env down
```

To set environment variables in the container, use the `environment` directive in [`compose.yaml`](compose.yaml).

```yaml
environment:
  - ORIGIN=${ORIGIN}
  - API_BACKEND_ADDRESS=${API_BACKEND_ADDRESS}
  - RUST_LOG=${RUST_LOG}
  - RUST_BACKTRACE=${RUST_BACKTRACE}
```
