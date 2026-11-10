output "parameter_prefix" {
  description = "SSM path the deploy script reads the .env files from."
  value       = var.parameter_prefix
}

output "parameter_arns" {
  description = "ARNs the instance may read: the prefix and everything under it."
  value = [
    "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${var.parameter_prefix}",
    "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${var.parameter_prefix}/*",
  ]
}
