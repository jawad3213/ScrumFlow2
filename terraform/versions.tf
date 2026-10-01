terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.80"
    }
  }

  # Recommended: keep state in S3 so it is not lost or out of sync between machines.
  # Create the bucket once, then uncomment and run `terraform init -migrate-state`.
  # backend "s3" {
  #   bucket       = "scrumflow-terraform-state"
  #   key          = "prod/terraform.tfstate"
  #   region       = "eu-west-3"
  #   use_lockfile = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
