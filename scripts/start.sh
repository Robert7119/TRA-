#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."
NODE_ENV=${NODE_ENV:-development}
PORT=${PORT:-3000}

export PORT
export NODE_ENV

npm start
