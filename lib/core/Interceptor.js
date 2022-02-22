const { loadDirectory } = require('./utils')
const path = require('path')
const Handlers = require('./Handlers')
const Fixtures = require('./Fixtures')
const MemoryState = require('./MemoryState')
const Interactor = require('./Interactor')
const { match } = require('path-to-regexp')

const defaultConfigDir = path.normalize(`.${path.sep}.appstrap`)

class Interceptor {
  constructor ({ configDir = defaultConfigDir, watch = false } = {}) {
    this.configDir = path.resolve(configDir)
    const config = loadDirectory(this.configDir)
    // todo validate config here
    this.state = new MemoryState(config)
    this.handlers = new Handlers(config)
    this.fixtures = new Fixtures(config)
    this.interactor = new Interactor({
      handlers: this.handlers,
      fixtures: this.fixtures
    })
    this.ingress = this.ingress.bind(this)
    if (watch) {
      // todo use/configure chokidar to call updateConfig
    }
  }

  updateConfig () {
    const config = loadDirectory(this.configDir)
    this.handlers.update(config)
    this.fixtures.update(config)
  }

  async ingress (context, next) {
    context.state = this.state
    const interactorRoute = this.getInteractorRoute(context)
    if (interactorRoute) {
      return interactorRoute.execute(context, next)
    }

    const interceptRoute = this.getInterceptRoute(context)
    if (interceptRoute) {
      const matcher = match(interceptRoute.path)
      const { path, params } = matcher(context.url)
      context.path = path
      context.params = params
      return interceptRoute.execute(context, next)
    }

    next()
  }

  getInteractorRoute (context) {
    return this.interactor.routeMap.find(({ path, method }) =>
      context.path === path && method.toUpperCase() === method
    )
  }

  getInterceptRoute (context) {
    return this.handlers.collection.find(handler => {
      const pathTest = match(handler.path)
      const pathMatch = pathTest(context.url)
      return pathMatch
    })
  }
}

module.exports = Interceptor
