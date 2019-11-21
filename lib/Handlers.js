const { normalizeRoutePathPrefix, sleep } = require('./helpers')
const { Router } = require('express')

class Handlers {
  constructor ({ config, modifiers, logger, state }) {
    this.logger = logger
    this.modifiers = modifiers
    this.state = state
    this.router = this.loadEndpoints(config.fileData.endpoints)
  }

  getModifier ({ path, method }) {
    const modifier = this.modifiers.get(`${normalizeRoutePathPrefix(path)}:::${method}`)
    return modifier || {}
  }

  loadEndpoints (endpoints) {
    if (!Array.isArray(endpoints) || endpoints.length === 0) {
      this.logger.warn('No endpoints defined in configuration file.  Please define endpoints to intercept.')
      return
    }
    const router = Router({})
    endpoints.forEach(({ path, ...handlers }) => {
      Object.keys(handlers).forEach(method => {
        router[method](
          normalizeRoutePathPrefix(path),
          this.latencyMiddleware(path, method),
          this.errorMiddleware(path, method),
          async (req, res, next) => {
            const { enabled = true } = this.getModifier({ path, method })
            enabled ? handlers[method](req, res, next, this.state) : next()
          })
      })
    })
    return router
  }

  latencyMiddleware (path, method) {
    return async (req, res, next) => {
      const { latency = false, latencyMS = 0 } = this.getModifier({ path, method })
      if (latency) { await sleep(latencyMS) }
      next()
    }
  }

  errorMiddleware (path, method) {
    return (req, res, next) => {
      const { error = false, status = 500, message = 'appstrap generated error' } = this.getModifier({ path, method })
      error ? res.status(status).send(message) : next()
    }
  }
}

exports = module.exports = Handlers
