const { ErrEndpointInvalid } = require('./errors')

class Endpoint {
  constructor (
    {
      path = throwInvalidError(),
      method = throwInvalidError(),
      handler = throwInvalidError()
    },
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

function throwInvalidError () {
  throw new ErrEndpointInvalid()
}

module.exports = Endpoint
