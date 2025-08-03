# Monitoring Options

- **Traefik Dashboard**: Enabled at :8080 (see docker-compose and traefik.toml)
- **Prometheus/Grafana**: Add services to docker-compose for metrics and dashboards.
- **Postgres Exporter**: For database metrics, add a postgres_exporter service.

## Example (add to docker-compose.yml):

```
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - appnet

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    networks:
      - appnet
```

See official docs for more details. 