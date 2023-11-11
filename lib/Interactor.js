const { Router } = require('express')
const { ERR_NO_MATCHING_ROUTE_UPDATE, ERR_NO_MATCHING_METHOD_UPDATE, ERR_METHOD_REQUIRED_TO_UPDATE } = require('./_errors')

class Interactor {
  constructor ({ config, events }) {
    this.routes = config.routes
    this.fixtures = config.fixtures
    this.state = config.state
    this.events = events
    this.routePrefix = '__interactor'
    this.router = this.loadInteractorRoutes()
  }

  loadInteractorRoutes () {
    const router = Router({})
    const handlers = [
      { route: 'setRouteEnabled', method: 'post' },
      { route: 'setModifier', method: 'post' },
      { route: 'clearModifiers', method: 'get' },
      { route: 'getStatus', method: 'get' },
      { route: 'activateFixture', method: 'post' },
      { route: 'activateFixtures', method: 'post' },
      { route: 'deactivateFixture', method: 'post' },
      { route: 'injectState', method: 'post' },
      { route: 'addResponseSequence', method: 'post' }
    ]
    handlers.forEach(({ route, method }) => {
      router[method](`/${this.routePrefix}/${route}`, (req, res) => {
        try {
          res.json(this[route](req.body))
        } catch (e) {
          const statusCode = (e.cause && e.cause.statusCode) ? e.cause.statusCode : 500
          res.status(statusCode).json({ message: e.message })
        }
      })
    })
    return router
  }

  getStatus () {
    const activeFixtures = Array.from(this.fixtures.active)
    const fixtures = Array.from(this.fixtures.collection).map(([name]) =>
      ({ name, active: false, order: activeFixtures.indexOf(name) + 1 })
    )
    return ({
      fixtures,
      routes: Array.from(this.routes.collection.values()),
      state: this.state
    })
  }

  setModifier ({ key, method, ...args }) {
    const route = this.routes.collection.get(key)
    if (!route) {
      throw new Error(ERR_NO_MATCHING_ROUTE_UPDATE, { cause: { statusCode: 404 } })
    }
    if (!method && route.type !== 'GQL') {
      throw new Error(ERR_METHOD_REQUIRED_TO_UPDATE, { cause: { statusCode: 400 } })
    }

    Object.keys(args).forEach(arg => {
      handler[arg] = args[arg]
    })
    if (res) { res.sendStatus(200) }
  }

  setRouteEnabled ({ key, method, enabled }) {
    if (!this.routes.collection.has(key)) {
      throw new Error(ERR_NO_MATCHING_ROUTE_UPDATE, { cause: { statusCode: 404 } })
    }
    const route = this.routes.collection.get(key)
    if (method) { // set single http method according to enabled value
      const methodKey = method.toUpperCase()
      if (!route.methods.has(methodKey)) {
        throw new Error(ERR_NO_MATCHING_METHOD_UPDATE)
      }
      const _method = route.methods.get(methodKey)
      _method.enabled = enabled
      route.methods.set(methodKey, _method)
    } else { // set all http methods according to enabled value
      for (const [httpVerb, methodHandler] of route.methods) {
        methodHandler.enabled = enabled
        route.methods.set(httpVerb, methodHandler)
      }
    }
    return route
  }

  activateFixture (fixtureName, res) {
    const name = typeof fixtureName === 'string' ? fixtureName : fixtureName.name
    this.fixtures.activateFixture(name)
    if (res) { res.sendStatus(200) }
  }

  activateFixtures (fixtureArray, res) {
    fixtureArray.forEach(fixtureName => this.activateFixture(fixtureName))
    if (res) { res.sendStatus(200) }
  }

  deactivateFixture (fixtureName, res) {
    const name = typeof fixtureName === 'string' ? fixtureName : fixtureName.name
    this.fixtures.deactivateFixture(name)
    if (res) { res.sendStatus(200) }
  }

  injectState (update, res) {
    this.memoryStore.state = update
    if (res) { res.sendStatus(200) }
  }

  addResponseSequence (handlerList, res) {
    handlerList.forEach(({ path, method, responseSequence }) => {
      const handler = this.handlers.pick({ path, method })
      handler.responseSequence = responseSequence
    })
    if (res) { res.sendStatus(200) }
  }
}

exports = module.exports = Interactor
