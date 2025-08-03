#!/bin/sh
set -e

URL=${1:-http://localhost:8000/health}

if curl -fsS $URL; then
  echo "Health check passed."
  exit 0
else
  echo "Health check failed!"
  exit 1
fi 