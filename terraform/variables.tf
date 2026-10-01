variable "aws_region" {
  description = "AWS region where everything is deployed."
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  description = "Prefix used for resource names."
  type        = string
  default     = "scrumflow"
}

variable "environment" {
  description = "Environment name (used in names, tags and the SSM parameter path)."
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "EC2 instance type. 4 app containers + Postgres need at least 2 GB of RAM."
  type        = string
  default     = "t3.small"
}

variable "root_volume_size" {
  description = "Root EBS volume size in GiB (Docker images + Postgres data)."
  type        = number
  default     = 30
}

variable "ssh_key_name" {
  description = "Existing EC2 key pair name for SSH. Leave null to rely on SSM Session Manager only."
  type        = string
  default     = null
}

variable "ssh_allowed_cidrs" {
  description = "CIDRs allowed to SSH on port 22. Empty list = port 22 closed (use SSM Session Manager)."
  type        = list(string)
  default     = []
}

variable "github_owner" {
  description = "GitHub user/organisation that owns the repository."
  type        = string
  default     = "jawad3213"
}

variable "github_repo" {
  description = "GitHub repository name."
  type        = string
  default     = "ScrumFlow"
}

variable "github_deploy_branch" {
  description = "Branch allowed to assume the deploy role."
  type        = string
  default     = "main"
}

variable "github_environment" {
  description = "GitHub Actions environment used by the CD jobs (also allowed to assume the role)."
  type        = string
  default     = "production"
}

variable "create_github_oidc_provider" {
  description = "Set to false if the GitHub OIDC provider already exists in this AWS account (only one is allowed per account)."
  type        = bool
  default     = true
}

variable "env_files" {
  description = "Local .env files uploaded to SSM Parameter Store (key = parameter name read by deploy/deploy.sh, value = path relative to this folder). Missing files are skipped."
  type        = map(string)
  default = {
    "root.env"     = "env/root.env"
    "backend.env"  = "env/backend.env"
    "frontend.env" = "env/frontend.env"
  }
}

variable "dockerhub_token" {
  description = "Docker Hub access token (Read-only) so the server can pull PRIVATE images. Leave null for public repositories."
  type        = string
  default     = null
  sensitive   = true
}
