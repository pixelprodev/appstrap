class Endpoint {
  constructor ({path, method, handler}) {
    this.path = path
    this.method = method
    this.handler = handler
    this.error = false
    this.errorStatus = 500
    this.latency = false
    this.latencyMS = 0
  }
}

module.exports = Endpoint
