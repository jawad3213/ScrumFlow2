output "security_group_id" {
  description = "Security group of the web server."
  value       = aws_security_group.app.id
}

output "subnet_id" {
  description = "Public subnet (default VPC) the instance runs in."
  value       = data.aws_subnets.default.ids[0]
}
