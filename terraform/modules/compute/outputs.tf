output "instance_id" {
  description = "ID of the server."
  value       = aws_instance.app.id
}

output "instance_arn" {
  description = "ARN of the server (the deploy role may only run commands on it)."
  value       = aws_instance.app.arn
}

output "public_ip" {
  description = "Elastic IP of the server."
  value       = aws_eip.app.public_ip
}
