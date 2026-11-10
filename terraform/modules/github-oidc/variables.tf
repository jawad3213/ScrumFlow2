variable "name" {
  description = "Prefix of the resource names (project-environment)."
  type        = string
}

variable "aws_region" {
  description = "Region of the SSM document the role may run."
  type        = string
}

variable "github_owner" {
  description = "GitHub user/organisation that owns the repository."
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name."
  type        = string
}

variable "deploy_branch" {
  description = "Branch allowed to assume the deploy role."
  type        = string
}

variable "github_environment" {
  description = "GitHub Actions environment allowed to assume the deploy role."
  type        = string
}

variable "create_oidc_provider" {
  description = "false when the GitHub OIDC provider already exists in the account (only one is allowed)."
  type        = bool
}

variable "instance_arn" {
  description = "The only instance the deploy role may send commands to."
  type        = string
}
