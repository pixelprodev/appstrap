const express = require('express')
const bodyParser = require('body-parser')
const Logger = require('./Logger')
const Handlers = require('./Handlers')
const Fixtures = require('./Fixtures')
const InMemoryState = require('./InMemoryState')
const Interactor = require('./Interactor')
const Config = require('./Config')
const chokidar = require('chokidar')

class Appstrap extends express {
  constructor ({
    watch = false,
    configDir = './.appstrap',
    logger = Logger
  } = {}) {
    super()
    this.logger = logger
    this.use(bodyParser.json())
    this.history = []

    // control cached responses
    this.set('etag', false)
    this.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next() })

    this.configureRoutes = configureRoutes.bind(this)
    this.loadConfiguration = loadConfiguration.bind(this)
    this.updateConfiguration = updateConfiguration.bind(this)

    this.config = new Config(configDir, this.logger)
    this.loadConfiguration()

    if (watch) {
      this.fileWatcher = chokidar.watch(this.config.absConfigDir, { ignoreInitial: true })
      this.fileWatcher.on('all', () => { this.updateConfiguration() })
    }
  }

  reset () {
    this.loadConfiguration()
  }
}

function loadConfiguration () {
  this.handlers = new Handlers(this)
  this.fixtures = new Fixtures(this)
  this.memoryStore = new InMemoryState(this.config.initialState)
  this.interactor = new Interactor(this)
  this.configureRoutes()
}

function updateConfiguration () {
  this.config.update()
  this.handlers.update()
  this.fixtures.update()
  this.configureRoutes()
}

function configureRoutes () {
  const router = express.Router({})
  const handlers = Array.from(this.handlers.collection.values())
  handlers.forEach((handler) => {
    if (!router[handler.method]) { return }
    router[handler.method](
      handler.path,
      (req, res, next) => handler.execute(req, res, next, this.memoryStore.state)
    )
  })
  // default fall-through
  router.all('*', (req, res, next) => next())
  this.routes = router

  // always ensure a fresh router (for reloads)
  const existingRoutesIndex = this._router.stack.findIndex(route => route.name === 'handleRoutes')
  if (existingRoutesIndex >= 0) { this._router.stack.splice(existingRoutesIndex, 1) }
  const handleRoutes = (req, res, next) => this.routes(req, res, next)
  this.use(handleRoutes)
  this.use((req, res, next) => this.interactor.router(req, res, next))
}

module.exports = Appstrap
