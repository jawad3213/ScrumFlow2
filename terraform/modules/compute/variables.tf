variable "name" {
  description = "Prefix of the resource names (project-environment)."
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type."
  type        = string
}

variable "root_volume_size" {
  description = "Root EBS volume size in GiB (Docker images + Postgres data)."
  type        = number
}

variable "ssh_key_name" {
  description = "Existing EC2 key pair name, or null for SSM Session Manager only."
  type        = string
  default     = null
}

variable "subnet_id" {
  description = "Subnet of the instance."
  type        = string
}

variable "security_group_ids" {
  description = "Security groups of the instance."
  type        = list(string)
}

variable "config_parameter_arns" {
  description = "SSM parameter ARNs the instance may read (the app .env files)."
  type        = list(string)
}
