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
    this.use(configureEndpoints.call(this, this.config))
    this.use((req, res, next) => this.interactor.router(req, res, next))
  }
}

function configureEndpoints (config) {
  const router = express.Router({})
  for (const [url, endpoint] of config.endpoints) {
    router.all(url, async (req, res, next) => {
      const context = { req, res, next }
      try {
        const payload = await endpoint.execute(context, config.fixtures)
        // todo handle manual rejects etc

        /*
        * TODO: fix this hacky bs
        * forwarding a request and maintaining headers is tough without streaming.  Because forwardRequest
        * handles returning the stream data, payload could be undefined.  If we attempt to return again express
        * will yell at us.  This is temporary until I can find another solution to the request forwarding.
        * */
        if (payload) {
          res.json(payload)
        }
      } catch (e) {
        res.status(500).send({ message: e.message })
      }
    })
  }

  const existingRoutesIndex = this._router.stack.findIndex(route => route.name === 'handleEndpoints')
  if (existingRoutesIndex >= 0) { this._router.stack.splice(existingRoutesIndex, 1) }

  return function handleEndpoints (req, res, next) { return router(req, res, next) }
}

module.exports = Appstrap
