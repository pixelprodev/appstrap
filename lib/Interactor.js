const { Router } = require('express')

class Interactor {
  constructor ({ handlers, fixtures, memoryStore }) {
    this.helpers = generateHelpers()
    this.handlers = handlers
    this.fixtures = fixtures
    this.memoryStore = memoryStore
    this.routePrefix = '__interactor'
    this.router = this.loadInteractorRoutes()
  }

  loadInteractorRoutes () {
    const router = Router({})
    const handlers = [
      { route: 'setHandlerEnabled', method: 'post' },
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
        this[route](req.body, res)
      })
    })
    return router
  }

  getStatus (args, res) {
    const fixtureGroups = Array.from(this.fixtures.collection.keys())
    const fixtures = fixtureGroups.map(fixture => ({ name: fixture, active: false }))
    Array.from(this.fixtures.activeFixtures.values()).forEach((activeFixtureName, indexOrder) => {
      const indexInGroup = fixtures.findIndex(fixture => fixture.name === activeFixtureName)
      fixtures[indexInGroup].active = true
      fixtures[indexInGroup].order = indexOrder + 1
    })
    const status = {
      fixtures,
      routes: Array.from(this.handlers.collection.values()),
      state: this.memoryStore.state
    }
    return res ? res.json(status) : status
  }

  setHandlerEnabled ({ path, method, enabled }, res) {
    const handler = this.handlers.pick(path, method)
    handler.disabled = !enabled
    if (res) { res.sendStatus(200) }
  }

  setModifier ({ path, method, ...args }, res) {
    const handler = this.handlers.pick(path, method)
    Object.keys(args).forEach(arg => {
      handler[arg] = args[arg]
    })
    if (res) { res.sendStatus(200) }
  }

  activateFixture (fixtureName, res) {
    const name = typeof fixtureName === 'string' ? fixtureName : fixtureName.name
    this.fixtures.activateFixture(name.toLowerCase())
    if (res) { res.sendStatus(200) }
  }

  activateFixtures (fixtureArray, res) {
    fixtureArray.forEach(fixtureName => this.activateFixture(fixtureName))
    if (res) { res.sendStatus(200) }
  }

  deactivateFixture (fixtureName, res) {
    const name = typeof fixtureName === 'string' ? fixtureName : fixtureName.name
    this.fixtures.deactivateFixture(name.toLowerCase())
    if (res) { res.sendStatus(200) }
  }

  injectState (update, res) {
    this.memoryStore.state = update
    if (res) { res.sendStatus(200) }
  }

  addResponseSequence (handlerList, res) {
    handlerList.forEach(({ path, method, responseSequence }) => {
      const handler = this.handlers.pick(path, method)
      handler.responseSequence = responseSequence
    })
    if (res) { res.sendStatus(200) }
  }
}

exports = module.exports = Interactor

function generateHelpers () {
  function generateHandler (message, status) {
    return (req, res) => res.status(status).send(message)
  }

  return {
    successfulResponse: (message, status = 200) => generateHandler(message, status),
    errorResponse: (message, status = 500) => generateHandler(message, status)
  }
}
