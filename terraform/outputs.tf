output "gke_cluster_name" {
  value = module.gke.cluster_name
}

output "gke_cluster_endpoint" {
  value     = module.gke.cluster_endpoint
  sensitive = true
}

output "sql_connection_name" {
  value = module.sql.connection_name
}

output "sql_private_ip" {
  value = module.sql.private_ip
}

output "artifact_registry_url" {
  description = "URL push Docker image: docker push <url>/techshop-backend:latest"
  value       = module.artifact_registry.repository_url
}
