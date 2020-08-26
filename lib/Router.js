const { normalizeWebRoutePathPrefix } = require('./_helpers')
const path = require('path')
const express = require('express')

class Router {
  constructor ({ config, handlers, logger, memoryStore }) {
    this.logger = logger
    this.memoryStore = memoryStore
    this.configure(config, handlers)
  }

  configure ({ configPath, fileData: { statics = [] } }, handlers) {
    this.configureStatic({ statics, configPath })
    this.configureRoutes({ handlers })
  }

  configureStatic ({ configPath, statics }) {
    const staticRouter = express.Router({})
    statics.forEach(({ web, local }) =>
      staticRouter.use(normalizeWebRoutePathPrefix(web), express.static(path.resolve(configPath, local).replace('/', '')))
    )
    this.staticRoutes = staticRouter
  }

  configureRoutes ({ handlers }) {
    const router = express.Router({})
    if (handlers.collection.size > 0) {
      handlers.collection.forEach(handler => {
        router[handler.method](
          handler.path,
          (req, res, next) => handler.execute(req, res, next, this.memoryStore.state)
        )
      })
    } else {
      this.logger.warn('No routes defined in configuration file.  Please define routes to strap.')
    }
    this.routes = router
  }
}

exports = module.exports = Router
