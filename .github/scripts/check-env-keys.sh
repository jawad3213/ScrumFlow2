#!/usr/bin/env bash
# The code has no default values: every variable it reads must be listed in the matching env files,
# or the service refuses to start. This checks the examples and test files against the code.
# Run from the repository root: .github/scripts/check-env-keys.sh
set -euo pipefail

status=0
keys_of() { grep -oE '^[A-Za-z_][A-Za-z0-9_]*=' "$1" | tr -d '=' | sort -u; }

# require <what> <file> <variable...>: each variable must be a key of the file
require() {
  local what="$1" file="$2"; shift 2
  local missing
  missing=$(comm -23 <(printf '%s\n' "$@" | sort -u) <(keys_of "$file"))
  if [ -n "$missing" ]; then
    echo "::error file=$file::$what needs: $(echo $missing)"
    status=1
  else
    echo "ok  $file ($what)"
  fi
}

# Backend: the ${VAR} placeholders of application.yml
backend=$(grep -oE '\$\{[A-Z_][A-Z0-9_]*\}' backend/src/main/resources/application.yml | tr -d '${}' | sort -u)
require "backend" backend/.env.example $backend
require "backend tests" backend/src/test/resources/test.env $backend
# In production the DB credentials come from root.env (docker-compose.prod.yml passes them on)
require "backend (production)" terraform/env/backend.env.example $(printf '%s\n' $backend | grep -vxE 'DB_(DATABASE|USERNAME|PASSWORD)')

# AI service: required_env("VAR") in main.py
ai=$(grep -oE 'required_env\("[A-Z_][A-Z0-9_]*"\)' "Ai System/main.py" | grep -oE '"[^"]+"' | tr -d '"' | sort -u)
require "AI service" "Ai System/.env.example" $ai
require "AI tests" "Ai System/tests/test.env" $ai

# Compose: ${VAR...} interpolations ($$VAR is the container's own variable, not interpolated)
compose_vars() { grep -oE '(^|[^$])\$\{[A-Z_][A-Z0-9_]*' "$@" | grep -oE '[A-Z_][A-Z0-9_]*$' | sort -u; }
require "docker-compose.prod.yml" terraform/env/root.env.example $(compose_vars docker-compose.prod.yml)
require "docker-compose.prod.yml" .env.production.example $(compose_vars docker-compose.prod.yml)
require "docker compose (development)" .env.example $(compose_vars docker-compose.yml docker-compose.override.yml)

exit $status
