FROM nginx:alpine
# Copy our custom routing config
COPY default.conf /etc/nginx/conf.d/default.conf
COPY 00-rate-limits.conf /etc/nginx/conf.d/00-rate-limits.conf
# stub_status on the internal port 8080, read by the Prometheus nginx exporter
COPY 10-status.conf /etc/nginx/conf.d/10-status.conf
COPY scrumflow-locations.conf /etc/nginx/snippets/scrumflow-locations.conf
# HTTPS, switched on by TLS_DOMAIN (see 40-scrumflow-tls.sh)
COPY https.conf.template /etc/nginx/scrumflow/https.conf.template
COPY --chmod=755 40-scrumflow-tls.sh /docker-entrypoint.d/40-scrumflow-tls.sh

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
