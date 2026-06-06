group "default" {
  targets = ["f1-dash", "f1-dash-api", "f1-dash-realtime"]
}

group "arm64" {
  targets = ["f1-dash", "f1-dash-api", "f1-dash-realtime"]
  platforms = ["linux/arm64"]
}

group "amd64" {
  targets = ["f1-dash", "f1-dash-api", "f1-dash-realtime"]
  platforms = ["linux/amd64"]
}

group "all" {
  targets = ["f1-dash", "f1-dash-api", "f1-dash-realtime"]
  platforms = ["linux/arm64", "linux/amd64"]
}

target "docker-metadata-action" {}

// actual servives and images below

target "f1-dash" {
  inherits = ["docker-metadata-action"]

  context = "./dashboard"
  dockerfile = "dockerfile"

  # tags = ["ghcr.io/slowlydev/f1-dash:latest"]
}

target "f1-dash-api" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"
  target = "api"

  # tags = ["ghcr.io/slowlydev/f1-dash-api:latest"]
}

target "f1-dash-realtime" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"
  target = "realtime"

  # tags = ["ghcr.io/slowlydev/f1-dash-realtime:latest"]
}
