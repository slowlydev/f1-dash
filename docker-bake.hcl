group "default" {
  targets = ["f1-dash", "f1-dash-live", "f1-dash-api"]
}

variable "TAG" {
  default = "latest"
}

target "f1-dash" {

  context = "./dash"
  dockerfile = "dockerfile"

  platforms = ["linux/amd64", "linux/arm64"]

  tags = ["ghcr.io/slowlydev/f1-dash:${TAG}"]
}

target "f1-dash-api" {

  context = "."
  dockerfile = "dockerfile"
  target = "api"

  platforms = ["linux/amd64", "linux/arm64"]

  tags = ["ghcr.io/slowlydev/f1-dash-api:${TAG}"]
}

target "f1-dash-live" {

  context = "."
  dockerfile = "dockerfile"
  target = "live"

  platforms = ["linux/amd64", "linux/arm64"]

  tags = ["ghcr.io/slowlydev/f1-dash-live:${TAG}"]
}
