const {normalizeRoutePathPrefix, sleep} = require('./helpers')
const { Router } = require('express')

class Handlers {
  constructor ({ config, modifiers, logger }) {
    this.logger = logger
    this.modifiers = modifiers
    this.router = this.loadEndpoints(config.fileData.endpoints)
  }

  getModifier ({ path, method }) {
    return this.modifiers.get(`${normalizeRoutePathPrefix(path)}:::${method}`)
  }

  loadEndpoints (endpoints) {
    if (!Array.isArray(endpoints) || endpoints.length === 0) {
      this.logger.warn('No endpoints defined in configuration file.  Please define endpoints to intercept.')
      return
    }
    const router = Router({})
    endpoints.forEach(({ path, ...handlers }) => {
      Object.keys(handlers).forEach(method => {
        router[method](normalizeRoutePathPrefix(path), async (req, res, next) => {
          const modifier = this.getModifier({ path, method })
          if (modifier && modifier.error) {
            const { status = 500, message = 'appstrap generated error' } = modifier
            res.status(status).send(message)
            return
          }
          if (modifier && modifier.latency) {
            await sleep(modifier.latencyMS)
          }
          handlers[method](req, res, next)
        })
      })
    })
    return router
  }
}

exports = module.exports = Handlers
