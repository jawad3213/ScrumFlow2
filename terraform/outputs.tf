output "public_ip" {
  description = "Elastic IP of the server (point your DNS here)."
  value       = module.compute.public_ip
}

output "app_url" {
  value = "http://${module.compute.public_ip}"
}

output "instance_id" {
  description = "GitHub variable EC2_INSTANCE_ID"
  value       = module.compute.instance_id
}

output "github_actions_role_arn" {
  description = "GitHub variable AWS_ROLE_ARN"
  value       = module.github_oidc.role_arn
}

output "aws_region" {
  description = "GitHub variable AWS_REGION"
  value       = var.aws_region
}

output "ssm_parameter_prefix" {
  description = "Where scripts/deploy.sh reads root.env / backend.env / frontend.env from (SecureString parameters)."
  value       = module.config.parameter_prefix
}

output "ssm_session_command" {
  description = "Open a shell on the server without SSH."
  value       = "aws ssm start-session --target ${module.compute.instance_id} --region ${var.aws_region}"
}
