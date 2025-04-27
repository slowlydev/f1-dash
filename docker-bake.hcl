group "default" {
  targets = ["f1-dash", "f1-dash-live", "f1-dash-api"]
}

target "docker-metadata-action" {}

target "platform" {
  platforms = [
    "linux/amd64",
    "linux/arm64",
  ]
}

// acutal servives and images below

target "f1-dash" {
  inherits = ["docker-metadata-action", "platform"]

  context = "./dash"
  dockerfile = "dockerfile"
}

target "f1-dash-api" {
  inherits = ["docker-metadata-action", "platform"]

  context = "."
  dockerfile = "dockerfile"
  target = "api"
}

target "f1-dash-live" {
  inherits = ["docker-metadata-action", "platform"]
  
  context = "."
  dockerfile = "dockerfile"
  target = "live"
}
