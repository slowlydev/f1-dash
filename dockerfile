FROM rust:1.80.0-alpine3.20 AS builder

WORKDIR /usr/src/app
COPY . .

RUN apk add --no-cache musl-dev pkgconfig openssl libressl-dev
RUN cargo update -p openssl-sys
# only builds default members (live and api)
RUN cargo b -r

FROM alpine:3 as api
COPY --from=builder /usr/src/app/target/release/api /api
CMD [ "/api" ]

FROM alpine:3 as live
COPY --from=builder /usr/src/app/target/release/live /live
CMD [ "/live" ]