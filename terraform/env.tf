# ---------------------------------------------------------------------------
# Application .env files -> SSM Parameter Store (encrypted SecureString).
# deploy/deploy.sh downloads them onto the instance at every deploy:
#   root.env -> /opt/scrumflow/.env, backend.env -> backend.env, frontend.env -> frontend.env
# Note: the values are also stored in the Terraform state, keep it private.
# ---------------------------------------------------------------------------
locals {
  env_files = {
    for name, path in var.env_files : name => "${path.module}/${path}"
    if fileexists("${path.module}/${path}")
  }
}

resource "aws_ssm_parameter" "env" {
  for_each = local.env_files

  name  = "${local.param_prefix}/${each.key}"
  type  = "SecureString"
  tier  = "Intelligent-Tiering" # switches to Advanced (8 KB) if a file is bigger than 4 KB
  value = file(each.value)
}

resource "aws_ssm_parameter" "dockerhub_token" {
  count = var.dockerhub_token == null ? 0 : 1

  name  = "${local.param_prefix}/dockerhub-token"
  type  = "SecureString"
  value = var.dockerhub_token
}
