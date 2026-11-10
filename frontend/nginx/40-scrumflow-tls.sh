#!/bin/sh
# Run by the nginx image's entrypoint before nginx starts (/docker-entrypoint.d/).
# With TLS_DOMAIN set, serves HTTPS as soon as certbot has issued the certificate, and reloads
# nginx whenever the certificate is renewed. Without TLS_DOMAIN, the site stays HTTP only.
set -eu

if [ -z "${TLS_DOMAIN:-}" ]; then
    echo "scrumflow-tls: TLS_DOMAIN is not set, serving HTTP only"
    exit 0
fi

CERT="/etc/letsencrypt/live/${TLS_DOMAIN}/fullchain.pem"
CONF=/etc/nginx/conf.d/default.conf

use_https() {
    envsubst '${TLS_DOMAIN}' < /etc/nginx/scrumflow/https.conf.template > "$CONF"
}

last=""
if [ -f "$CERT" ]; then
    use_https
    last=$(stat -L -c %Y "$CERT")
    echo "scrumflow-tls: serving HTTPS for ${TLS_DOMAIN}"
else
    echo "scrumflow-tls: no certificate for ${TLS_DOMAIN} yet, serving HTTP until certbot issues one"
fi

# Watch for the first certificate and for renewals
(
    while sleep 300; do
        [ -f "$CERT" ] || continue
        current=$(stat -L -c %Y "$CERT")
        [ "$current" = "$last" ] && continue
        use_https && nginx -s reload && last=$current \
            && echo "scrumflow-tls: certificate for ${TLS_DOMAIN} loaded"
    done
) &
