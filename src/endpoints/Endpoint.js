const { ErrEndpointInvalid } = require('../errors')

class Endpoint {
  constructor (
    {
      path = this.throwInvalidError(),
      method = this.throwInvalidError(),
      handler = this.throwInvalidError()
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

  throwInvalidError () {
    throw new ErrEndpointInvalid()
  }
}

export default Endpoint
