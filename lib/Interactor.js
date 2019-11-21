const { Router } = require('express')

class Interactor {
  constructor ({ handlers, fixtures, memoryStore }) {
    this.handlers = handlers
    this.fixtures = fixtures
    this.memoryStore = memoryStore
    this.routePrefix = '__interactor'
    this.router = this.loadInteractorRoutes()
  }

  loadInteractorRoutes () {
    const router = Router({})
    const handlers = [
      'setHandlerEnabled',
      'setModifier',
      'clearModifiers',
      'getStatus',
      'activateFixture',
      'activateFixtures',
      'injectState'
    ]
    handlers.forEach(handler => {
      router.post(`/${this.routePrefix}/${handler}`, (req, res) => {
        this[handler](req.body, res)
      })
    })
    return router
  }

  getStatus (args, res) {
    const fixtureGroups = Array.from(this.fixtures.collection.keys())
    const status = {
      fixtures: fixtureGroups.map(fixture => ({ name: fixture, active: this.fixtures.activeFixtures.has(fixture) })),
      handlers: Array.from(this.handlers.collection.values()),
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
    this.fixtures.activateFixture(fixtureName)
    if (res) { res.sendStatus(200) }
  }

  activateFixtures (fixtureArray, res) {
    fixtureArray.forEach(fixtureName => this.activateFixture(fixtureName))
    if (res) { res.sendStatus(200) }
  }

  deactivateFixture (fixtureName, res) {
    this.fixtures.deactivateFixture(fixtureName)
    if (res) { res.sendStatus(200) }
  }

  injectState (update, res) {
    this.memoryStore.state = update
    if (res) { res.sendStatus(200) }
  }
}

exports = module.exports = Interactor
