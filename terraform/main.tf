terraform {
  required_version = ">= 1.6"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "techshop-tfstate-techshop-493002"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "vpc" {
  source     = "./modules/vpc"
  project_id = var.project_id
  region     = var.region
}

module "artifact_registry" {
  source     = "./modules/artifact-registry"
  project_id = var.project_id
  region     = var.region
}

module "gke" {
  source     = "./modules/gke"
  project_id = var.project_id
  region     = var.region
  network    = module.vpc.network_name
  subnetwork = module.vpc.subnet_name
  depends_on = [module.vpc]
}

module "sql" {
  source                = "./modules/sql"
  project_id            = var.project_id
  region                = var.region
  network_id            = module.vpc.network_id
  db_password           = var.db_password
  private_ip_range_name = module.vpc.private_ip_range_name
  depends_on            = [module.vpc]
}