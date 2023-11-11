const express = require('express')
const bodyParser = require('body-parser')
const Interactor = require('./Interactor')
const Config = require('./Config')
const EventEmitter = require('node:events').EventEmitter
const Logger = require('./Logger')

class Appstrap extends express {
  constructor ({ watch = false, repository, gqlEndpoint, logger = Logger } = {}) {
    super()
    this.use(bodyParser.json())

    // disable cached responses
    this.set('etag', false)
    this.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next() })
    this.logger = logger
    this.events = new EventEmitter()
    this.events.on('log', (event) => { this.logger[event.level](event.message) })

    this.config = new Config({ repository, watchEnabled: watch, gqlEndpoint, events: this.events })
    this.interactor = new Interactor({ config: this.config, events: this.events })
    this.use(configureRoutes.call(this, this.config))
    this.use((req, res, next) => this.interactor.router(req, res, next))
  }
}

function configureRoutes (config) {
  const router = express.Router({})

  for (const [_, route] of config.routes.collection) {
    for (const [method, routeHandler] of route.methods) {
      router[method.toLowerCase()](route.endpoint, async (req, res) => {
        res.json(await routeHandler.execute(req))
      })
    }
  }

  // default fall-through
  router.all('*', (req, res, next) => next())

  // always ensure a fresh router (for reloads)
  const existingRoutesIndex = this._router.stack.findIndex(route => route.name === 'handleRoutes')
  if (existingRoutesIndex >= 0) { this._router.stack.splice(existingRoutesIndex, 1) }

  return function handleRoutes (req, res, next) { return router(req, res, next) }
}

module.exports = Appstrap
