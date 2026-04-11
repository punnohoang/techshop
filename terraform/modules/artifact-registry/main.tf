resource "google_artifact_registry_repository" "techshop" {
  location      = var.region
  repository_id = "techshop"
  format        = "DOCKER"
  project       = var.project_id
  description   = "Docker images cho TechShop"
}

output "repository_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/techshop"
}

variable "project_id" {}
variable "region"     {}
