variable "aws_region" {
  description = "Region of the parameters (used in their ARNs)."
  type        = string
}

variable "parameter_prefix" {
  description = "SSM path of the parameters, e.g. /scrumflow/prod."
  type        = string
}

variable "env_files" {
  description = "Parameter name => path of an existing local file whose content becomes the value."
  type        = map(string)
}

variable "dockerhub_token" {
  description = "Docker Hub read-only token for private images, or null."
  type        = string
  default     = null
  sensitive   = true
}
