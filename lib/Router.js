const { normalizeRoutePathPrefix, normalizeWebRoutePathPrefix, sleep } = require('./_helpers')
const path = require('path')
const express = require('express')

class Router {
  constructor ({ config, handlers, logger, state }) {
    this.logger = logger
    this.state = state
    this.configure(config, handlers)
  }

  getModifier ({ path, method }) {
    const modifier = this.modifiers.get(`${normalizeRoutePathPrefix(path)}:::${method}`)
    return modifier || {}
  }

  configure ({ configPath, fileData: { statics = [] } }, handlers) {
    this.configureStatic({ statics, configPath })
    this.configureRoutes({ handlers })
  }

  configureStatic ({ configPath, statics }) {
    const staticRouter = express.Router({})
    statics.forEach(({ web, local }) =>
      staticRouter.use(normalizeWebRoutePathPrefix(web), express.static(path.resolve(configPath, local)))
    )
    this.staticRoutes = staticRouter
  }

  configureRoutes ({ handlers }) {
    if (handlers.collection.size === 0) {
      this.logger.warn('No routes defined in configuration file.  Please define routes to strap.')
      return
    }
    const router = express.Router({})
    handlers.collection.forEach(handler => {
      router[handler.method](handler.path, (req, res, next) => handler.execute(req, res, next))
    })
    this.routes = router
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

exports = module.exports = Router
