const GQL = require('./GraphQL')
const axios = require('axios')

class Interceptor {
  constructor ({ config, fixtures, handlers, gqlEndpoint }) {
    this.config = config
    this.fixtures = fixtures
    this.handlers = handlers
    this.gqlEndpoint = gqlEndpoint
  }

  async intercept (req, res, next, state) {
    let responsePayload = {}

    const proxyDestination = this.getProxyDestination(req)
    if (proxyDestination) {
      responsePayload = await this.getProxiedResult(proxyDestination, req, res)
    } else {
      if (req.path === this.gqlEndpoint) {
        responsePayload = GQL.handleGqlRequest(req, res, next, state)
      }

      const handler = this.handlers.pick({ path: req.path, method: req.method })
      if (handler) {
        responsePayload = await handler.execute(req, res, next, state)
      }
    }
    responsePayload = this.fixtures.applyFixtures(req, responsePayload)
    if (typeof responsePayload === 'string') {
      return res.send(responsePayload)
    }
    return res.json(responsePayload)
  }

  getProxyDestination (req) {
    for (const pathToProxy of Object.keys(this.config.proxyMap)) {
      const matcher = new RegExp(pathToProxy)
      if (matcher.test(req.path)) {
        return this.config.proxyMap[pathToProxy]
      }
    }
  }

  async getProxiedResult (proxyDestination, req) {
    const options = {
      method: req.method.toLowerCase(),
      url: proxyDestination,
      headers: req.headers
    }
    if (req.body) {
      options.data = req.body
    }
    const { data: response } = await axios(options)
    return response
  }
}

module.exports = Interceptor
