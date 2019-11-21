const { Router } = require('express')

class Handlers {
  constructor ({ config, events, logger }) {
    this.logger = logger
    this.events = events
    this.router = this.loadEndpoints(config.fileData.endpoints)
  }

  loadEndpoints (endpoints) {
    if (!Array.isArray(endpoints) || endpoints.length === 0) {
      this.logger.warn('No endpoints defined in configuration file.  Please define endpoints to intercept.')
      return
    }
    const router = Router({})
    endpoints.forEach(({ path, ...handlers }) => {
      Object.keys(handlers).forEach(method => {
        router[method](path, handlers[method])
      })
    })
    return router
  }
}

module.exports = exports = Handlers
