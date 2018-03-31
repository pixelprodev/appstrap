class Endpoint {
  constructor (
    {path, method, handler},
    {
      error = false,
      errorStatus = 500,
      latency = false,
      latencyMS = 0
    } = {}
  ) {
    this.path = path
    this.method = method
    this.handler = handler
    this.error = error
    this.errorStatus = errorStatus
    this.latency = latency
    this.latencyMS = latencyMS
  }
}

module.exports = Endpoint
