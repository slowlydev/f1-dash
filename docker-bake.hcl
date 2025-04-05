group "default" {
  targets = ["dash", "live", "api"]
}

variable "TAG" {
  default = "latest"
}

target "docker-metadata-action" {}

target "dash" {
  inherits = ["docker-metadata-action"]

  context = "./dash"
  dockerfile = "dockerfile"

  args = {
    ENABLE_TRACKING = "true",
    LIVE_SOCKET_URL = "http://localhost:4000",
    API_URL = "http://localhost:4001"
  }

  tags = ["ghcr.io/slowlydev/f1-dash:${TAG}"]
}

target "api" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"

  tags = ["ghcr.io/slowlydev/f1-dash-api:${TAG}"]
}

target "live" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"

  tags = ["ghcr.io/slowlydev/f1-dash-live:${TAG}"]
}
