resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = var.network_id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [var.private_ip_range_name]
}

resource "google_sql_database_instance" "postgres" {
  name             = "techshop-db"
  database_version = "POSTGRES_16"
  region           = var.region
  project          = var.project_id

  deletion_protection = false

  depends_on = [google_service_networking_connection.private_vpc_connection]

  settings {
    tier = "db-f1-micro"

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.network_id
    }

    backup_configuration {
      enabled    = true
      start_time = "03:00"
    }
  }
}

resource "google_sql_database" "techshop" {
  name     = "techshop"
  instance = google_sql_database_instance.postgres.name
  project  = var.project_id
}

resource "google_sql_user" "app_user" {
  name     = "postgres"
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
  project  = var.project_id
}

output "connection_name" { value = google_sql_database_instance.postgres.connection_name }
output "private_ip"      { value = google_sql_database_instance.postgres.private_ip_address }

variable "project_id"          {}
variable "region"               {}
variable "network_id"           {}
variable "db_password"          { sensitive = true }
variable "private_ip_range_name" {}