const { sleep } = require('../../_helpers')
const { forwardRequest } = require('./forwardRequest')

const defaultModifiers = {
  error: false,
  errorCode: 500,
  errorMessage: 'appstrap generated error',
  latency: false,
  latencyMS: 0,
  enabled: true,
  responseSequence: [],
  allowRequestForwarding: true
}

class Endpoint {
  constructor () {
    this.enabled = true
    this.requestForwardingURL = null
    this.modifiers = new Map()
  }

  async execute (context, fixtures, fn, modifiers) {
    if (!this.enabled || !modifiers.enabled) { return context.next() }
    let payload = {}

    if (modifiers.latency) { await sleep(modifiers.latencyMS) }

    if (modifiers.error) { throw new Error(modifiers.errorMessage, { cause: { statusCode: modifiers.errorCode } }) }

    if (modifiers.responseSequence.length > 0) {

    } else {
      if (modifiers.allowRequestForwarding && this.requestForwardingURL) {
        // todo convert this from streaming to something we can keep all in the same request cycle
        await forwardRequest(context, this.requestForwardingURL, fixtures.applyActive.bind(fixtures))
        return
      } else {
        if (fn) {
          payload = fn(context)
        }
      }
    }

    return fixtures.applyActive(context, payload)
  }
}

class RestEndpoint extends Endpoint {
  constructor ({ url, methods }) {
    super({ url })
    this.endpointType = 'REST'
    this.methods = methods
    for (const method of Object.keys(methods)) {
      this.modifiers.set(method, defaultModifiers)
    }
  }

  async execute (context, fixtures) {
    const httpVerb = context.req.method
    if (typeof this.methods[httpVerb] === 'undefined') { return context.next() }
    const method = this.methods[httpVerb]
    const modifiers = this.modifiers.get(httpVerb)
    return super.execute(context, fixtures, method, modifiers)
  }
}

class GraphEndpoint extends Endpoint {
  constructor ({ url, operations }) {
    super({ url })
    this.endpointType = 'GQL'
    this.operations = operations
    for (const operation of operations.keys()) {
      this.modifiers.set(operation, defaultModifiers)
    }
  }

  async execute (context, fixtures) {
    const operationName = context.req.body.operationName
    const modifiers = this.modifiers.has(operationName) ? this.modifiers.get(operationName) : defaultModifiers
    return super.execute(context, fixtures, this.operations.get(operationName), modifiers)
  }
}

module.exports = exports = {
  RestEndpoint,
  GraphEndpoint
}
