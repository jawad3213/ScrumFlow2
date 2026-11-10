output "role_arn" {
  description = "Role GitHub Actions assumes (GitHub variable AWS_ROLE_ARN)."
  value       = aws_iam_role.github_actions.arn
}
