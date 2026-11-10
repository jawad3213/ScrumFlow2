# ScrumFlow production infrastructure: one EC2 instance running docker-compose.prod.yml.
#
#   network      default VPC, security group (80/443 open, 22 optional)
#   config       terraform/env/*.env -> SSM SecureString parameters, read by scripts/deploy.sh
#   compute      EC2 + Elastic IP, instance role (SSM agent, read the config parameters)
#   github_oidc  role GitHub Actions assumes to deploy (SSM send-command on this instance only)

locals {
  name         = "${var.project_name}-${var.environment}"
  param_prefix = "/${var.project_name}/${var.environment}"

  # Only the env files that exist locally are uploaded
  env_files = {
    for name, file in var.env_files : name => "${path.root}/${file}"
    if fileexists("${path.root}/${file}")
  }
}

module "network" {
  source = "./modules/network"

  name              = local.name
  ssh_allowed_cidrs = var.ssh_allowed_cidrs
}

module "config" {
  source = "./modules/config"

  aws_region       = var.aws_region
  parameter_prefix = local.param_prefix
  env_files        = local.env_files
  dockerhub_token  = var.dockerhub_token
}

module "compute" {
  source = "./modules/compute"

  name                  = local.name
  instance_type         = var.instance_type
  root_volume_size      = var.root_volume_size
  ssh_key_name          = var.ssh_key_name
  subnet_id             = module.network.subnet_id
  security_group_ids    = [module.network.security_group_id]
  config_parameter_arns = module.config.parameter_arns
}

module "github_oidc" {
  source = "./modules/github-oidc"

  name                 = local.name
  aws_region           = var.aws_region
  github_owner         = var.github_owner
  github_repo          = var.github_repo
  deploy_branch        = var.github_deploy_branch
  github_environment   = var.github_environment
  create_oidc_provider = var.create_github_oidc_provider
  instance_arn         = module.compute.instance_arn
}
