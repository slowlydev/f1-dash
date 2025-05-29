group "default" {
  targets = ["f1-dash", "f1-dash-live", "f1-dash-api", "f1-dash-importer", "f1-dash-analytics"]
}

target "docker-metadata-action" {}

// acutal servives and images below

target "f1-dash" {
  inherits = ["docker-metadata-action"]

  context = "./dash"
  dockerfile = "dockerfile"
}

target "f1-dash-api" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"
  target = "api"
}

target "f1-dash-live" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"
  target = "live"
}

target "f1-dash-importer" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"
  target = "importer"
}

target "f1-dash-analytics" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"
  target = "analytics"
}
