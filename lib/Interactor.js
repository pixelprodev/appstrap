const { Router } = require('express')
const { ERR_NO_MATCHING_ENDPOINT_UPDATE, ERR_NO_MATCHING_METHOD_UPDATE, ERR_METHOD_REQUIRED_TO_UPDATE } = require('./_errors')
const { GraphEndpoint } = require('./Config/endpoints/Endpoint')

class Interactor {
  constructor ({ config, events }) {
    this.endpoints = config.endpoints
    this.fixtures = config.fixtures
    this.state = config.state
    this.events = events
    this.routePrefix = '__interactor'
    this.router = this.loadInteractorRoutes()
  }

  loadInteractorRoutes () {
    const router = Router({})
    const handlers = [
      { route: 'setEndpointEnabled', method: 'post' },
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
      routes: Array.from(this.endpoints.values()),
      state: this.state
    })
  }

  setModifier ({ key, method, ...updatedModifiers }) {
    const { endpoint } = this.endpoints.getByKey(key)
    if (!endpoint) {
      throw new Error(ERR_NO_MATCHING_ENDPOINT_UPDATE, { cause: { statusCode: 404 } })
    }
    const isGQL = endpoint instanceof GraphEndpoint
    if (!method && !isGQL) {
      throw new Error(ERR_METHOD_REQUIRED_TO_UPDATE, { cause: { statusCode: 400 } })
    }
    const modifierKey = isGQL ? key : method
    if (!endpoint.modifiers.has(modifierKey)) {
      throw new Error(ERR_NO_MATCHING_METHOD_UPDATE, { cause: { statusCode: 400 } })
    }
    return endpoint.modifiers
      .set(modifierKey, { ...endpoint.modifiers.get(modifierKey), ...updatedModifiers })
      .get(modifierKey)
  }

  setEndpointEnabled ({ key, method, enabled }) {
    const { key: mappedKey, endpoint } = this.endpoints.getByKey(key)
    if (!endpoint) {
      throw new Error(ERR_NO_MATCHING_ENDPOINT_UPDATE, { cause: { statusCode: 404 } })
    }
    const isGQL = endpoint instanceof GraphEndpoint
    return method || (isGQL && mappedKey !== key)
      ? this.setModifier({ key, method, enabled })
      : this.endpoints.set(mappedKey, { ...endpoint, enabled }).get(mappedKey)
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
