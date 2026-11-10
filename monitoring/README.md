# Monitoring (Prometheus + Grafana)

Prometheus and Grafana run on the same EC2 instance as the application, in the same Docker
network, started by `docker-compose.prod.yml`. Grafana opens on the **ScrumFlow Platform**
dashboard.

| Where | Address |
|-------|---------|
| Grafana (production) | `GRAFANA_ROOT_URL`, e.g. `https://YOUR_DOMAIN/grafana/`, user `admin` |
| Grafana (development) | `http://localhost:8080/grafana/` |
| Prometheus (development) | `http://localhost:9090` |

In production no monitoring port is published. Grafana is reached through the nginx gateway, and
its login is rate limited like the application's. Prometheus is only reachable from Grafana
(Explore). To open the Prometheus UI itself, forward the port through SSM:

```bash
aws ssm start-session --target <EC2_INSTANCE_ID> --document-name AWS-StartPortForwardingSession \
  --parameters portNumber=9090,localPortNumber=9090   # needs the prometheus port mapped on the host
```

## What is collected

| Source | Exporter | Metrics |
|--------|----------|---------|
| Backend (Spring Boot) | Actuator + Micrometer, `/actuator/prometheus` on `MANAGEMENT_PORT` (8081) | HTTP requests by endpoint and status with latency histograms, JVM memory, GC, threads, CPU, HikariCP pool, log errors |
| AI service (FastAPI) | prometheus-fastapi-instrumentator, `/metrics` | Requests by endpoint and status, duration up to 5 minutes, calls in progress |
| Gateway (nginx) | nginx-prometheus-exporter, reads `stub_status` on the internal port 8080 | Requests, connections |
| PostgreSQL | postgres-exporter | Connections, transactions, rows, cache hit ratio, size, deadlocks |
| EC2 host | node-exporter | CPU, load, memory, swap, disk space and I/O |
| Containers | cAdvisor | CPU, memory, network and uptime per container |

None of the metrics endpoints is reachable from the internet. The backend's metrics live on a
separate port that nginx never proxies, and nginx answers 404 to `/ai/metrics`.

## The dashboard

`grafana/dashboards/scrumflow-platform.json`, with these sections:

1. **Overview.** Up or down status of every component, API traffic, error rate and p95 latency,
   AI analyses in progress, host CPU, memory and disk, and the alerts currently firing.
2. **Backend API.** Requests by status, latency percentiles, the busiest, slowest and failing
   endpoints, sign-in activity and logged errors. The "API endpoint" selector filters the panels.
3. **Backend JVM and database pool.** Heap, garbage collection, CPU and threads, HikariCP connections.
4. **AI service.** Analyses per minute, duration per endpoint, calls in progress.
5. **Gateway.** nginx requests and connections.
6. **PostgreSQL.**
7. **Host.** The EC2 instance's CPU, load, memory, disks and network.
8. **Containers.** CPU, memory, network and uptime per container.

The dashboard is provisioned read-only. To change it, edit it in Grafana, export the JSON
(Share > Export), replace the file, and redeploy.

## Alerts

`prometheus/alerts.yml` defines the alert rules: a component down, API errors or slowness, JVM
heap, database pool or connections, deadlocks, AI errors, and host CPU, memory or disk. Firing
alerts appear in the dashboard's "Firing alerts" table. No Alertmanager is deployed, so nothing is
sent. For notifications, add a contact point and alert rules in Grafana (Alerting).

## Resources

Retention is 15 days, capped at 2 GB. The monitoring containers have memory limits of about 1 GB in
total: Prometheus 400 MB, Grafana 256 MB, cAdvisor 200 MB, the other exporters 32 to 64 MB each.
On the default `t3.small` (2 GB of RAM) that is tight next to the JVM, PostgreSQL and the AI
service. A `t3.medium` (4 GB) is recommended: set `instance_type` in `terraform/terraform.tfvars`.

## Configuration

| Variable (root `.env` / `terraform/env/root.env`) | Purpose |
|------|---------|
| `GRAFANA_ADMIN_PASSWORD` | Password of the `admin` user, applied when Grafana first creates its database. Change it later in Grafana. |
| `GRAFANA_ROOT_URL` | Public address of Grafana including `/grafana/` |
| `MANAGEMENT_PORT` (backend env) | Port of `/actuator/prometheus`; must stay 8081, the port Prometheus scrapes |

Development: `docker compose --profile monitoring up -d` starts the same stack locally.
