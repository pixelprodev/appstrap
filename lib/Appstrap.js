const express = require('express')
const bodyParser = require('body-parser')
const Config = require('./Config')
const Logger = require('./Logger')
const Router = require('./Router')
const Interactor = require('./Interactor')
const InMemoryState = require('./InMemoryState')
const HandlerCollection = require('./HandlerCollection')

exports = module.exports = function strap (opts) {
  return new App(opts)
}

class App extends express {
  constructor ({ logger = new Logger(), ...opts } = {}) {
    super(opts)
    this.use(bodyParser.json())
    this.logger = logger

    this.config = new Config({ ...opts, logger: this.logger })

    this.state = new InMemoryState(this.config.fileData.initialState).state

    this.handlers = new HandlerCollection({ ...this })

    this.interactor = new Interactor({ ...this })
    this.use((req, res, next) => this.interactor.router(req, res, next))

    const router = new Router({ ...this })
    this.use((req, res, next) => router.staticRoutes(req, res, next))
    this.use((req, res, next) => router.routes(req, res, next))
  }
}
