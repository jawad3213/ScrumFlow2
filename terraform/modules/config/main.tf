# ---------------------------------------------------------------------------
# Application .env files -> SSM Parameter Store (encrypted SecureString).
# scripts/deploy.sh downloads them onto the instance at every deploy:
#   root.env -> /opt/scrumflow/.env, backend.env -> backend.env, frontend.env -> frontend.env
# Note: the values are also stored in the Terraform state, keep it private.
# ---------------------------------------------------------------------------
data "aws_caller_identity" "current" {}

resource "aws_ssm_parameter" "env" {
  for_each = var.env_files

  name  = "${var.parameter_prefix}/${each.key}"
  type  = "SecureString"
  tier  = "Intelligent-Tiering" # switches to Advanced (8 KB) if a file is bigger than 4 KB
  value = file(each.value)
}

resource "aws_ssm_parameter" "dockerhub_token" {
  count = var.dockerhub_token == null ? 0 : 1

  name  = "${var.parameter_prefix}/dockerhub-token"
  type  = "SecureString"
  value = var.dockerhub_token
}
