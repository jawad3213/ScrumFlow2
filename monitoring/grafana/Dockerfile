# Grafana with the Prometheus datasource and the ScrumFlow dashboard provisioned (image scrumflow-grafana).
# Served by the nginx gateway at /grafana/. The admin password and the public URL come from the
# environment (GF_SECURITY_ADMIN_PASSWORD, GF_SERVER_ROOT_URL), set by docker compose.
FROM grafana/grafana:13.2.4

ENV GF_SERVER_SERVE_FROM_SUB_PATH=true \
    GF_SECURITY_ADMIN_USER=admin \
    GF_USERS_ALLOW_SIGN_UP=false \
    GF_AUTH_ANONYMOUS_ENABLED=false \
    GF_ANALYTICS_REPORTING_ENABLED=false \
    GF_ANALYTICS_CHECK_FOR_UPDATES=false \
    GF_ANALYTICS_CHECK_FOR_PLUGIN_UPDATES=false \
    GF_NEWS_NEWS_FEED_ENABLED=false \
    GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH=/etc/grafana/dashboards/scrumflow-platform.json

COPY provisioning /etc/grafana/provisioning
COPY dashboards /etc/grafana/dashboards
