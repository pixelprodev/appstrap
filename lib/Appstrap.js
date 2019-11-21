const express = require('express')
const bodyParser = require('body-parser')
const Config = require('./Config')
const Logger = require('./Logger')
const Handlers = require('./Handlers')
const Interactor = require('./Interactor')

exports = module.exports = function strap (opts) {
  return new App(opts)
}

class App extends express {
  constructor ({ logger = new Logger(), ...opts } = {}) {
    super(opts)
    this.use(bodyParser.json())
    this.logger = logger
    this.modifiers = new Map()

    this.config = new Config({ ...opts, logger: this.logger })

    this.interactor = new Interactor({ ...this })
    this.use((req, res, next) => this.interactor.router(req, res, next))

    this.handlers = new Handlers({ ...this })
    this.use((req, res, next) => this.handlers.router(req, res, next))
  }
}
