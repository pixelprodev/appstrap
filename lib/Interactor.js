const {normalizeRoutePathPrefix} = require('./helpers')
const { Router } = require('express')

class Interactor {
  constructor ({ modifiers }) {
    this.modifiers = modifiers
    this.routePrefix = '__interactor'
    this.router = this.loadInteractorRoutes()
  }

  loadInteractorRoutes () {
    const router = Router({})
    const handlers = ['toggleHandler', 'setModifier', 'clearModifiers']
    handlers.forEach(handler => {
      router.post(`/${this.routePrefix}/${handler}`, (req, res) => {
        try {
          this[handler](req.body)
          res.sendStatus(200)
        } catch (e) {
          res.send(e.message).status(500)
        }
      })
    })
    return router
  }

  toggleHandler (args) {

  }

  setModifier ({ path, method, ...args }) {
    this.modifiers.set(`${normalizeRoutePathPrefix(path)}:::${method}`, args)
  }

  clearModifiers ({ path, method }) {
    this.modifiers.delete(`${normalizeRoutePathPrefix(path)}:::${method}`)
  }
}

exports = module.exports = Interactor
