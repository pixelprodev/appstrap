const express = require('express')
const bodyParser = require('body-parser')
const Config = require('./Config')
const Logger = require('./Logger')
const Router = require('./Router')
const Interactor = require('./Interactor')
const InMemoryState = require('./InMemoryState')
const HandlerManager = require('./HandlerManager')
const FixtureManager = require('./FixtureManager')
const chokidar = require('chokidar')

exports = module.exports = function strap (opts) {
  return new App(opts)
}

class App extends express {
  constructor ({ logger = new Logger(), ...opts } = {}) {
    super(opts)
    this.opts = opts
    this.use(bodyParser.json())
    this.logger = logger

    this.loadConfiguration = loadConfiguration.bind(this)
    this.loadConfiguration()
  }
}

function loadConfiguration () {
  const opts = this.opts
  this.config = new Config({ ...opts, logger: this.logger })

  this.memoryStore = new InMemoryState(this.config.fileData.initialState)

  this.handlers = new HandlerManager({ ...this })
  this.fixtures = new FixtureManager({ ...this })

  this.interactor = new Interactor({ ...this })
  this.use((req, res, next) => this.interactor.router(req, res, next))

  const router = new Router({ ...this })
  this.use((req, res, next) => router.staticRoutes(req, res, next))
  this.use((req, res, next) => router.routes(req, res, next))

  if (this.opts.watch) {
    this.fileWatcher = chokidar.watch(this.config.modulesList, { ignoreInitial: true })
    this.fileWatcher.on('add', () => { this.fileWatcher.close(); this.loadConfiguration() })
    this.fileWatcher.on('change', () => { this.fileWatcher.close(); this.loadConfiguration() })
    this.fileWatcher.on('unlink', () => { this.fileWatcher.close(); this.loadConfiguration() })
  }
}
