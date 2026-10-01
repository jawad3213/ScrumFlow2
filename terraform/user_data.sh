#!/bin/bash
# First-boot bootstrap: Docker + Compose plugin + AWS CLI.
# The application itself is deployed by .github/workflows/cd.yml (via SSM).
set -euxo pipefail
exec > >(tee /var/log/user-data.log) 2>&1

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl unzip jq

# Docker Engine + compose plugin
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker
usermod -aG docker ubuntu

# AWS CLI v2 (used by deploy.sh to read the .env files from SSM Parameter Store)
curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip
unzip -q /tmp/awscliv2.zip -d /tmp
/tmp/aws/install
rm -rf /tmp/aws /tmp/awscliv2.zip

# 2 GB swap: a t3.small is tight for 5 containers
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# SSM agent ships as a snap on Canonical AMIs
snap start amazon-ssm-agent || true

mkdir -p /opt/scrumflow
