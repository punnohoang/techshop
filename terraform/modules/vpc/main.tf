resource "google_compute_network" "vpc" {
  name                    = "techshop-vpc"
  auto_create_subnetworks = false
  project                 = var.project_id
}

resource "google_compute_subnetwork" "subnet" {
  name          = "techshop-subnet"
  ip_cidr_range = "10.0.0.0/20"
  region        = var.region
  network       = google_compute_network.vpc.id
  project       = var.project_id

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/20"
  }
}

resource "google_compute_router" "router" {
  name    = "techshop-router"
  region  = var.region
  network = google_compute_network.vpc.id
  project = var.project_id
}

resource "google_compute_router_nat" "nat" {
  name                               = "techshop-nat"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
  project                            = var.project_id
}

# Chỉ tạo IP range ở đây, connection sẽ tạo trong module sql
resource "google_compute_global_address" "private_ip_range" {
  name          = "techshop-private-ip-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
  project       = var.project_id
}

output "network_name"          { value = google_compute_network.vpc.name }
output "network_id"            { value = google_compute_network.vpc.id }
output "subnet_name"           { value = google_compute_subnetwork.subnet.name }
output "private_ip_range_name" { value = google_compute_global_address.private_ip_range.name }

variable "project_id" {}
variable "region"     {}