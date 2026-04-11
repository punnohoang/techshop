variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "asia-southeast1" # Singapore - gần VN nhất
}

variable "db_password" {
  description = "Mật khẩu Cloud SQL PostgreSQL"
  type        = string
  sensitive   = true
}
