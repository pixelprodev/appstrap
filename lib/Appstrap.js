const express = require('express')
const EventEmitter = require('events').EventEmitter
const Config = require('./Config')
const Logger = require('./Logger')
const Handlers = require('./Handlers')

exports = module.exports = function strap (opts) {
  return new App(opts)
}

class App extends express {
  constructor ({ logger = new Logger(), ...opts } = {}) {
    super(opts)
    this.events = new EventEmitter()
    this.logger = logger
    this.config = new Config({ ...opts, events: this.events, logger: this.logger })
    this.handlers = new Handlers({ config: this.config, events: this.events, logger: this.logger })
    this.use((req, res, next) => this.handlers.router(req, res, next))
  }
}
