output "public_ip" {
  description = "Elastic IP of the server (point your DNS here)."
  value       = aws_eip.app.public_ip
}

output "app_url" {
  value = "http://${aws_eip.app.public_ip}"
}

output "instance_id" {
  description = "GitHub variable EC2_INSTANCE_ID"
  value       = aws_instance.app.id
}

output "github_actions_role_arn" {
  description = "GitHub variable AWS_ROLE_ARN"
  value       = aws_iam_role.github_actions.arn
}

output "aws_region" {
  description = "GitHub variable AWS_REGION"
  value       = var.aws_region
}

output "ssm_parameter_prefix" {
  description = "Where deploy.sh reads root.env / backend.env / frontend.env from (SecureString parameters created by env.tf)."
  value       = local.param_prefix
}

output "ssm_session_command" {
  description = "Open a shell on the server without SSH."
  value       = "aws ssm start-session --target ${aws_instance.app.id} --region ${var.aws_region}"
}
