#!/bin/bash

set -e

name="dev-f1-data"
app="dev-f1-data"

red="$(tput setaf 1)"
green="$(tput setaf 2)"
yellow="$(tput setaf 3)"
blue="$(tput setaf 4)"
cyan="$(tput setaf 6)"
reset="$(tput sgr0)"
bold="$(tput bold)"

log() {
  case ${1} in
  "debug")
    echo "${bold}${blue}[${name}]${reset} ${bold}${cyan}${1}${reset}: ${2}"
    ;;
  "info")
    echo "${bold}${blue}[${name}]${reset} ${bold}${green}${1}${reset}: ${2}"
    ;;
  "warn")
    echo "${bold}${blue}[${name}]${reset} ${bold}${yellow}${1}${reset}: ${2}"
    ;;
  "error")
    echo "${bold}${blue}[${name}]${reset} ${bold}${red}${1}${reset}: ${2}"
    ;;
  *)
    echo "${bold}${blue}[${name}]${reset} ${bold}${1}${reset}: ${2}"
    ;;
  esac
}

error() {
  if [[ $? != 0 ]]; then
    log "error" "deployment failed"
    log "warn" "executing fallback"
    start
  fi
}

deploy() {
  trap error exit
  stop

  log "info" "pulling latest..."
  git pull &>/dev/null
  log "info" "latest downloaded"

  log "info" "building executable..."
  cargo build --release
  log "info" "executable built"

  start
}

start() {
  if screen -list | grep -q "\.${app}"; then
    log "warn" "${app} is already running"
    log "type" "screen -r ${app} to view the session"
    return
  fi

  log "info" "starting server..."
  screen -dmSL "${app}" -Logfile "screen.log" ./target/release/backend

  checks=0
  while [ ${checks} -lt 4 ]; do
    if ! screen -list | grep -q "\.${app}"; then
      log "debug" "awaiting startup..."
    fi
    checks=$((checks + 1))
    sleep 1s
  done

  if screen -list | grep -q "\.${app}"; then
    log "info" "server started"
  else
    log "error" "server failed to start"
    exit 1
  fi
}

stop() {
  if ! screen -list | grep -q "\.${app}"; then
    log "warn" "${app} is not running"
    return
  fi

  log "info" "stopping server..."
  screen -S "${app}" -X quit

  checks=0
  while [ ${checks} -lt 4 ]; do
    if screen -list | grep -q "\.${app}"; then
      log "debug" "awaiting stop..."
    else
      break
    fi
    checks=$((checks + 1))
    sleep 1s
  done

  if ! screen -list | grep -q "\.${app}"; then
    log "info" "server stopped"
  else
    log "error" "server failed to stop"
    exit 1
  fi
}

help() {
  log "error" "'${1}' is not an available command"
  log "info" "available commands are start stop deploy"
}

case ${1} in
"deploy")
  deploy
  exit 0
  ;;
"start")
  start
  exit 0
  ;;
"stop")
  stop
  exit 0
  ;;
*)
  help ${1}
  exit 1
  ;;
esac
