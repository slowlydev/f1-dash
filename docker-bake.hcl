group "default" {
  targets = ["dash", "live", "api"]
}

variable "TAG" {
  default = "latest"
}

target "dash" {
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
  context = "."
  dockerfile = "dockerfile"
  tags = ["ghcr.io/slowlydev/f1-dash-api:${TAG}"]
}

target "live" {
  context = "."
  dockerfile = "dockerfile"
  tags = ["ghcr.io/slowlydev/f1-dash-live:${TAG}"]
}
