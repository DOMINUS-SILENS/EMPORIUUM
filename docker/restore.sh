#!/bin/sh
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <backup_file.sql>"
  exit 1
fi

BACKUP_FILE=$1

docker exec -i $(docker-compose ps -q db) psql -U user ecommerce < $BACKUP_FILE

echo "Database restored from $BACKUP_FILE" 