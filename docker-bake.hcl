group "default" {
  targets = ["f1-dash", "f1-dash-live", "f1-dash-api"]
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
