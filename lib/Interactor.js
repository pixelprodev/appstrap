const { Router } = require('express')
const { ACTIVATE_FIXTURE, DEACTIVATE_FIXTURE, SET_MODIFIER } = require('./Config/constants')
const selEndpoints = require('./Config/actions/selEndpoints')

class Interactor {
  constructor (config) {
    this.getCurrentConfig = config.state.getState
    this.dispatch = config.state.dispatch
    this.routePrefix = '__interactor'
    this.router = this.loadInteractorRoutes()
  }

  loadInteractorRoutes () {
    const router = Router({})
    const handlers = [
      { route: 'setModifier', method: 'post' },
      { route: 'clearModifiers', method: 'get' },
      { route: 'getConfig', method: 'get' },
      { route: 'activateFixture', method: 'post' },
      { route: 'activateFixtures', method: 'post' },
      { route: 'deactivateFixture', method: 'post' }
      // { route: 'injectState', method: 'post' },
      // { route: 'addResponseSequence', method: 'post' }
    ]
    handlers.forEach(({ route, method }) => {
      router[method](`/${this.routePrefix}/${route}`, (req, res) => {
        try {
          res.send(JSON.stringify(this[route](req.body), (key, val) => {
            if (val instanceof Set) {
              return Array.from(val).map((_val, order) => ({ key: _val, index: order + 1 }))
            }
            if (typeof val === 'function') {
              return `(${val})`
            }
            return val
          }))
        } catch (e) {
          const statusCode = (e.cause && e.cause.statusCode) ? e.cause.statusCode : 500
          res.status(statusCode).json({ message: e.message })
        }
      })
    })
    return router
  }

  getConfig () {
    const config = this.getCurrentConfig()
    return { ...config, endpoints: selEndpoints(config) }
  }

  setModifier ({ key, method, ...updatedModifiers }) {
    this.dispatch({ type: SET_MODIFIER, key, method, meta: updatedModifiers })
  }

  activateFixture (fixtureName) {
    const name = typeof fixtureName === 'string' ? fixtureName : fixtureName.name
    this.dispatch({ type: ACTIVATE_FIXTURE, name })
  }

  activateFixtures (fixtureArray) {
    fixtureArray.forEach(fixtureName => this.activateFixture(fixtureName))
  }

  deactivateFixture (fixtureName) {
    const name = typeof fixtureName === 'string' ? fixtureName : fixtureName.name
    this.dispatch({ type: DEACTIVATE_FIXTURE, name })
  }

  // injectState (update, res) {
  //   this.memoryStore.state = update
  //   if (res) { res.sendStatus(200) }
  // }

  // addResponseSequence (handlerList, res) {
  //   handlerList.forEach(({ path, method, responseSequence }) => {
  //     const handler = this.handlers.pick({ path, method })
  //     handler.responseSequence = responseSequence
  //   })
  //   if (res) { res.sendStatus(200) }
  // }
}

exports = module.exports = Interactor
