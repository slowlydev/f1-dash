FROM rust:alpine AS base

RUN apk add --no-cache musl-dev pkgconfig openssl libressl-dev

FROM base AS builder

WORKDIR /usr/src/app

COPY . .

# only builds default members (live and api)
RUN cargo b -r

FROM alpine:3 AS api
COPY --from=builder /usr/src/app/target/release/api /api
CMD [ "/api" ]

FROM alpine:3 AS live
COPY --from=builder /usr/src/app/target/release/live /live
CMD [ "/live" ]
