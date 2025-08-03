#!/bin/sh
set -e

BACKUP_DIR=./backups
mkdir -p $BACKUP_DIR
FILENAME=$BACKUP_DIR/pg_backup_$(date +%Y%m%d_%H%M%S).sql

docker exec -t $(docker-compose ps -q db) pg_dump -U user ecommerce > $FILENAME

echo "Backup saved to $FILENAME" 