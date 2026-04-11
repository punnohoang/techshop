resource "google_container_cluster" "primary" {
  name     = "techshop-cluster"
  location = var.region
  project  = var.project_id

  # Autopilot: không cần quản lý nodes thủ công, tiết kiệm $300 credit
  enable_autopilot = true

  network    = var.network
  subnetwork = var.subnetwork

  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }

  # Xoá cluster default node pool (Autopilot tự quản lý)
  deletion_protection = false
}

output "cluster_name"     { value = google_container_cluster.primary.name }
output "cluster_endpoint" { value = google_container_cluster.primary.endpoint }

variable "project_id"  {}
variable "region"      {}
variable "network"     {}
variable "subnetwork"  {}
