const { sleep } = require('../_helpers')

class Route {
  constructor ({ endpoint, methods, applyFixtures }) {
    this.endpoint = endpoint
    this.methods = new Map()
    Object.entries(methods).forEach(([method, routeHandler]) =>
      this.methods.set(
        method,
        new RouteHandler({
          method: method.toUpperCase(),
          routeHandler,
          applyFixtures
        })
      )
    )
  }
}

class RouteHandler {
  constructor ({ applyFixtures, method, routeHandler = () => ({}) }) {
    this.method = method.toUpperCase()
    this.applyFixtures = applyFixtures
    this.fn = routeHandler
    this.setDefaults()
  }

  setDefaults () {
    this.error = false
    this.errorCode = 500
    this.errorMessage = 'appstrap generated error'
    this.latency = false
    this.latencyMS = 0
    this.enabled = true
    this.responseSequence = []
    this.proxyEnabled = false
    this.proxyEndpoint = null
  }

  async execute (req, res, next) {
    if (!this.enabled) { return next() }

    let responsePayload = {}
    if (this.proxyEnabled) {
      responsePayload = await this.proxyResponse(this.proxyEndpoint)
    }
    if (this.latency) { await sleep(this.latencyMS) }
    if (this.error) { return res.status(this.errorCode).send(this.errorMessage) }
    if (this.responseSequence.length > 0) {
      const nextResponse = this.responseSequence.shift()
      responsePayload = nextResponse(req)
    } else { // use default function handler
      responsePayload = this.fn(req)
    }
    return this.applyFixtures(req, responsePayload)
  }

  async proxyResponse () {

  }
}

exports = module.exports = Route
