# Prometheus with the ScrumFlow scrape targets and alert rules baked in (image scrumflow-prometheus).
FROM prom/prometheus:v3.15.0

COPY prometheus.yml /etc/prometheus/prometheus.yml
COPY alerts.yml /etc/prometheus/alerts.yml

# 15 days of metrics, capped at 2 GB of disk (the EC2 root volume is shared with the application)
CMD ["--config.file=/etc/prometheus/prometheus.yml", \
     "--storage.tsdb.path=/prometheus", \
     "--storage.tsdb.retention.time=15d", \
     "--storage.tsdb.retention.size=2GB"]
