const express = require('express')
const bodyParser = require('body-parser')
const sleep = require('sleep-promise')

class AppServer {
  constructor () {
    this._app = express()

    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({extended: true}))

    this._loadDefaultRouter()
    this._app.use((req, res, next) => this._router(req, res, next))
  }

  _loadDefaultRouter () {
    const Router = express.Router({})
    Router.get('*', (req, res) => res.send('Welcome to appstrap!'))
    this._router = Router
  }

  reloadEndpoints (endpoints) { this.loadEndpoints(endpoints) }
  loadEndpoints (endpoints) {
    const Router = express.Router({})
    endpoints.forEach(({handler, method, path}, indx) => {
      Router[method](path,
        this.modifierMiddleware.bind(endpoints[indx]),
        handler
      )
    })
    this._router = Router
  }

  async modifierMiddleware (req, res, next) {
    if (this.latency) {
      await sleep(this.latencyMS)
    }
    return this.error
      ? res.sendStatus(this.errorStatus)
      : next()
  }
}

module.exports = AppServer
