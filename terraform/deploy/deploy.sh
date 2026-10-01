#!/bin/bash
# Runs ON the EC2 instance (as root, sent by .github/workflows/cd.yml through SSM).
# Required env: DOCKERHUB_NAMESPACE, IMAGE_TAG, AWS_REGION, PARAM_PREFIX
set -euo pipefail

: "${DOCKERHUB_NAMESPACE:?}" "${IMAGE_TAG:?}" "${AWS_REGION:?}" "${PARAM_PREFIX:?}"
APP_DIR=/opt/scrumflow
COMPOSE="docker compose -f docker-compose.prod.yml"
cd "$APP_DIR"

# 1. Pull runtime config from SSM Parameter Store (SecureString, uploaded by terraform/env.tf).
fetch_param() { # <parameter name> <target file> <required: yes|no>
  if aws ssm get-parameter --region "$AWS_REGION" --with-decryption \
       --name "$PARAM_PREFIX/$1" --query Parameter.Value --output text > "$2.tmp" 2>/dev/null; then
    mv "$2.tmp" "$2"
  elif [ "$3" = "yes" ]; then
    rm -f "$2.tmp"
    echo "ERROR: SSM parameter $PARAM_PREFIX/$1 is missing" >&2
    exit 1
  else
    rm -f "$2.tmp"
    touch "$2"
  fi
  chmod 600 "$2"
}
fetch_param root.env     .env          yes
fetch_param backend.env  backend.env   yes
fetch_param frontend.env frontend.env  no

# 2. Pull the new images from Docker Hub (login only needed for private repositories)
fetch_param dockerhub-token .dockerhub-token no
if [ -s .dockerhub-token ]; then
  docker login --username "$DOCKERHUB_NAMESPACE" --password-stdin < .dockerhub-token
fi
rm -f .dockerhub-token
export DOCKERHUB_NAMESPACE IMAGE_TAG
$COMPOSE pull

# 3. Restart the stack (Postgres volume is kept)
$COMPOSE up -d --remove-orphans

# 4. Database migrations (waits for Postgres to accept connections)
for i in $(seq 1 30); do
  if $COMPOSE exec -T backend php artisan migrate --force; then
    break
  fi
  [ "$i" -eq 30 ] && { echo "ERROR: migrations failed" >&2; exit 1; }
  echo "Waiting for the database... ($i/30)"
  sleep 5
done
$COMPOSE exec -T backend php artisan optimize || true

# 5. Cleanup old images to save disk
docker image prune -af --filter "until=72h" || true

$COMPOSE ps
echo "Deployed $DOCKERHUB_NAMESPACE/*:$IMAGE_TAG"
