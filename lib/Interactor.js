const { normalizeRoutePathPrefix } = require('./_helpers')
const { Router } = require('express')

class Interactor {
  constructor ({ modifiers }) {
    this.modifiers = modifiers
    this.routePrefix = '__interactor'
    this.router = this.loadInteractorRoutes()
  }

  loadInteractorRoutes () {
    const router = Router({})
    const handlers = ['setHandlerEnabled', 'setModifier', 'clearModifiers']
    handlers.forEach(handler => {
      router.post(`/${this.routePrefix}/${handler}`, (req, res) => {
        this[handler](req.body)
        res.sendStatus(200)
      })
    })
    return router
  }

  setHandlerEnabled ({ path, method, enabled }) {
    this.modifiers.set(`${normalizeRoutePathPrefix(path)}:::${method}`, { enabled })
  }

  setModifier ({ path, method, ...args }) {
    this.modifiers.set(`${normalizeRoutePathPrefix(path)}:::${method}`, args)
  }

  clearModifiers ({ path, method }) {
    this.modifiers.delete(`${normalizeRoutePathPrefix(path)}:::${method}`)
  }
}

exports = module.exports = Interactor
