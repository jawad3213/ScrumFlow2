variable "name" {
  description = "Prefix of the resource names (project-environment)."
  type        = string
}

variable "ssh_allowed_cidrs" {
  description = "CIDRs allowed to SSH on port 22. Empty list = port 22 closed."
  type        = list(string)
}
