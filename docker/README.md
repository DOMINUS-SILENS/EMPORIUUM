# docker/

This folder contains configuration and scripts for container orchestration and infrastructure:

- `traefik.toml`: Traefik reverse proxy configuration for routing and dashboard.
- `postgres-init.sql`: Optional Postgres initialization script (extensions, tables, etc.).

These files are used by `docker-compose.yml` at the project root. 