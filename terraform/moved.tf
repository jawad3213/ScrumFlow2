# The resources used to live in the root module (main.tf, env.tf, github_oidc.tf). These blocks
# tell Terraform they moved into modules, so an existing deployment is updated in place: without
# them, `terraform apply` would destroy and recreate the server (and the Postgres data on it).
# They can be removed once every state has been applied with this layout.

# network
moved {
  from = aws_security_group.app
  to   = module.network.aws_security_group.app
}
moved {
  from = aws_vpc_security_group_ingress_rule.http
  to   = module.network.aws_vpc_security_group_ingress_rule.http
}
moved {
  from = aws_vpc_security_group_ingress_rule.https
  to   = module.network.aws_vpc_security_group_ingress_rule.https
}
moved {
  from = aws_vpc_security_group_ingress_rule.ssh
  to   = module.network.aws_vpc_security_group_ingress_rule.ssh
}
moved {
  from = aws_vpc_security_group_egress_rule.all
  to   = module.network.aws_vpc_security_group_egress_rule.all
}

# config
moved {
  from = aws_ssm_parameter.env
  to   = module.config.aws_ssm_parameter.env
}
moved {
  from = aws_ssm_parameter.dockerhub_token
  to   = module.config.aws_ssm_parameter.dockerhub_token
}

# compute
moved {
  from = aws_iam_role.ec2
  to   = module.compute.aws_iam_role.ec2
}
moved {
  from = aws_iam_role_policy_attachment.ec2_ssm
  to   = module.compute.aws_iam_role_policy_attachment.ec2_ssm
}
moved {
  from = aws_iam_role_policy.ec2_params
  to   = module.compute.aws_iam_role_policy.ec2_params
}
moved {
  from = aws_iam_instance_profile.ec2
  to   = module.compute.aws_iam_instance_profile.ec2
}
moved {
  from = aws_instance.app
  to   = module.compute.aws_instance.app
}
moved {
  from = aws_eip.app
  to   = module.compute.aws_eip.app
}

# github_oidc
moved {
  from = aws_iam_openid_connect_provider.github
  to   = module.github_oidc.aws_iam_openid_connect_provider.github
}
moved {
  from = aws_iam_role.github_actions
  to   = module.github_oidc.aws_iam_role.github_actions
}
moved {
  from = aws_iam_role_policy.github_deploy
  to   = module.github_oidc.aws_iam_role_policy.github_deploy
}
