FROM rust:alpine AS base

RUN apk add --no-cache musl-dev pkgconfig openssl libressl-dev

FROM base AS builder-base
WORKDIR /usr/src/app
COPY . .

FROM builder-base AS api-builder
RUN cargo b -r -p api

FROM builder-base AS live-builder
RUN cargo b -r -p live

FROM alpine:3 AS api
COPY --from=api-builder /usr/src/app/target/release/api /api
CMD [ "/api" ]

FROM alpine:3 AS live
COPY --from=live-builder /usr/src/app/target/release/live /live
CMD [ "/live" ]
