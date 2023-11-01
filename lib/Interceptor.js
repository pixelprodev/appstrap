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
    const proxyDestination = this.getProxyDestination(req)
    if (proxyDestination) {
      return this.proxyRequest(proxyDestination, req, res)
    } else {
      let responsePayload = {}
      if (req.path === this.gqlEndpoint) {
        responsePayload = GQL.handleGqlRequest(req, res, next, state)
      }

      const handler = this.handlers.pick({ path: req.path, method: req.method })
      if (handler) {
        responsePayload = await handler.execute(req, res, next, state)
      }
      responsePayload = this.fixtures.applyFixtures(req, responsePayload)
      if (typeof responsePayload === 'string') {
        return res.send(responsePayload)
      }
      return res.json(responsePayload)
    }
  }

  getProxyDestination (req) {
    for (const pathToProxy of Object.keys(this.config.proxyMap)) {
      if (pathToProxy === '*') {
        return this.config.proxyMap[pathToProxy]
      }
      const matcher = new RegExp(pathToProxy)
      if (matcher.test(req.path)) {
        return this.config.proxyMap[pathToProxy]
      }
    }
  }

  async proxyRequest (proxyDestination, req, res) {
    const options = {
      responseType: 'stream',
      method: req.method.toLowerCase(),
      url: proxyDestination,
      headers: req.headers,
      useCredentials: true
    }
    if (req.body) {
      options.data = req.body
    }
    try {
      const { status, headers, data } = await axios(options)
      let chunks = ''

      data.on('data', (chunk) => (chunks += chunk))
      data.on('end', () => {
        res.status(status)
        res.set(headers)
        const data = JSON.parse(chunks.toString())
        const updatedData = this.fixtures.applyFixtures(req, data)
        res.write(JSON.stringify(updatedData))
        res.end()
      })
    } catch (e) {
      console.error(e)
      return {}
    }
  }
}

module.exports = Interceptor
