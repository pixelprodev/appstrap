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
    const handlers = ['setHandlerEnabled', 'setModifier', 'clearModifiers', 'getStatus']
    handlers.forEach(handler => {
      router.post(`/${this.routePrefix}/${handler}`, (req, res) => {
        this[handler](req.body, res)
      })
    })
    return router
  }

  getStatus () {

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

  activateFixture (fixtureName) {
    this.fixtures.activateFixture(fixtureName)
  }

  injectState (update) {
    this.memoryStore.state = update
  }
}

exports = module.exports = Interactor
