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

# 1b. Nothing has a default value any more: every key of the examples (sent by the CD workflow next to
#     this script) must be in the env files, or the containers would refuse to start after the pull.
keys() { grep -oE '^[A-Za-z_][A-Za-z0-9_]*=' "$1" | tr -d '=' | sort -u; }
require_keys() { # <example file> <env file> [keys provided by the deploy itself...]
  [ -f "$1" ] || return 0
  local example="$1" file="$2"; shift 2
  local missing
  missing=$(comm -23 <(keys "$example") <(keys "$file") | grep -vxF -f <(printf '%s\n' "$@" "") || true)
  if [ -n "$missing" ]; then
    echo "ERROR: $file lacks: $(echo $missing)" >&2
    echo "Add them to terraform/env/$(basename "$example" .example), run terraform apply, then redeploy." >&2
    exit 1
  fi
}
require_keys examples/root.env.example    .env        DOCKERHUB_NAMESPACE IMAGE_TAG
require_keys examples/backend.env.example backend.env

# 2. Pull the new images from Docker Hub (login only needed for private repositories)
fetch_param dockerhub-token .dockerhub-token no
if [ -s .dockerhub-token ]; then
  docker login --username "$DOCKERHUB_NAMESPACE" --password-stdin < .dockerhub-token
fi
rm -f .dockerhub-token
export DOCKERHUB_NAMESPACE IMAGE_TAG
$COMPOSE config --quiet # every ${VAR} of the compose file is defined (names the missing one)
$COMPOSE pull

# 3. Restart the stack (Postgres volume is kept)
$COMPOSE up -d --remove-orphans

# 4. Wait for the backend: it applies the Flyway database migrations at startup, then answers /up
for i in $(seq 1 30); do
  if $COMPOSE exec -T backend wget -qO- http://localhost:8000/up >/dev/null 2>&1; then
    echo "Backend is up"
    break
  fi
  [ "$i" -eq 30 ] && { echo "ERROR: backend did not become healthy" >&2; $COMPOSE logs --tail=100 backend >&2; exit 1; }
  echo "Waiting for the backend... ($i/30)"
  sleep 5
done

# 5. Cleanup old images to save disk
docker image prune -af --filter "until=72h" || true

$COMPOSE ps
echo "Deployed $DOCKERHUB_NAMESPACE/*:$IMAGE_TAG"
