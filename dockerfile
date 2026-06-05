FROM rust:alpine AS base

RUN apk add --no-cache musl-dev pkgconfig

FROM base AS builder-base
WORKDIR /usr/src/app

COPY Cargo.lock .
COPY Cargo.toml .

COPY realtime realtime
COPY shared shared
COPY signalr signalr
COPY api api
COPY simulator simulator

FROM builder-base AS builder
RUN cargo b -r


FROM alpine:3 AS runtime
COPY --from=builder /usr/src/app/target/release/api .
COPY --from=builder /usr/src/app/target/release/realtime .
