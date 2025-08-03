#!/bin/sh

echo "Starting all services in production mode..."
docker-compose -f docker-compose.yml up --build -d 