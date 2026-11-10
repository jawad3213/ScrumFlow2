# ScrumFlow infrastructure (Terraform)

One EC2 instance running `docker-compose.prod.yml`, deployed by GitHub Actions through SSM.

```
terraform/
├── main.tf            # wires the modules together
├── variables.tf       # inputs (region, instance type, GitHub repository, ...)
├── outputs.tf         # values for the GitHub repository variables
├── versions.tf        # Terraform / provider versions, optional S3 state backend
├── providers.tf       # AWS provider and default tags
├── moved.tf           # old root addresses -> module addresses (see below)
├── env/               # production .env files (git-ignored; *.example committed)
├── scripts/deploy.sh  # runs on the instance at every deploy (sent by .github/workflows/cd.yml)
└── modules/
    ├── network/       # default VPC, security group (80/443 open, 22 from ssh_allowed_cidrs)
    ├── compute/       # EC2, Elastic IP, instance role, user_data.sh (first-boot bootstrap)
    ├── config/        # env/*.env -> SSM SecureString parameters under /<project>/<environment>
    └── github-oidc/   # role GitHub Actions assumes: ssm:SendCommand on this instance only
```

## Configuration: the env files

The applications have no default values: every setting comes from these files, and a missing one
stops the service at startup.

| Local file | SSM parameter | On the instance |
|---|---|---|
| `env/root.env` | `/scrumflow/prod/root.env` | `/opt/scrumflow/.env` (compose variables: DB, images, TLS, AI CORS) |
| `env/backend.env` | `/scrumflow/prod/backend.env` | `/opt/scrumflow/backend.env` |
| `env/frontend.env` (optional) | `/scrumflow/prod/frontend.env` | `/opt/scrumflow/frontend.env` |

Copy each `*.example`, fill it in, then `terraform apply` uploads it. `scripts/deploy.sh` refuses to
deploy when a file lacks a key of its example, and names the missing keys. CI
(`.github/scripts/check-env-keys.sh`) checks that the examples list every variable the code reads.

## Usage

```bash
cp terraform.tfvars.example terraform.tfvars   # adjust
cp env/root.env.example env/root.env            # fill in, same for backend.env
terraform init
terraform apply
terraform output                                # -> GitHub variables AWS_REGION, AWS_ROLE_ARN, EC2_INSTANCE_ID
```

Changing a value later: edit `env/*.env`, `terraform apply`, then redeploy (re-run the CD workflow).

## moved.tf

The resources used to be declared directly in the root module. `moved.tf` maps each old address to
its module, so `terraform plan` on an existing deployment shows them as moved, not as destroyed and
recreated (which would replace the server and lose the Postgres data). Check that the first plan
after this change reports no `destroy`. The blocks can be deleted once every state has been applied.
