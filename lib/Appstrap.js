const logger = require('./Logger')
const Config = require('./Config')

// TODO: Convert this reference to pull in the lib once its separated out
const ExpressAdapter = require('../adapters/express')

function strap (opts = {}, Adapter = ExpressAdapter) {
  logger.info(`starting appstrap using adapter: ${Adapter.name}`)

  const config = new Config({ ...opts, adapter: Adapter.name })
  return new Adapter({ config })
}

exports = module.exports = strap

// class App extends express {
//   constructor ({ logger = new Logger(), ...opts } = {}) {
//     super(opts)
//     this.opts = opts
//     this.use(bodyParser.json())
//     this.logger = logger
//     this.history = []
//
//     this.logCycle = logCycle.bind(this)
//     this.loadConfiguration = loadConfiguration.bind(this)
//     this.reset = reset.bind(this)
//     this.loadConfiguration()
//     this.use((req, res, next) => this.interactor.router(req, res, next))
//     this.use((req, res, next) => this.strapRouter.staticRoutes(req, res, next))
//     this.use((req, res, next) => this.strapRouter.routes(req, res, next))
//   }
// }

// function logCycle (req, res, responsePayload) {
//   let parsedPayload
//   try { parsedPayload = JSON.parse(responsePayload) } catch (e) {}
//   this.history.push({
//     reqPath: req.path,
//     reqBody: req.body,
//     reqQuery: req.query,
//     reqMethod: req.method,
//     reqHeaders: req.headers,
//     resStatus: res.statusCode,
//     resHeaders: res._header,
//     resPayload: parsedPayload || responsePayload
//   })
// }
//
// function reset () {
//   this.history = []
//   this.loadConfiguration()
// }
//
// function loadConfiguration () {
//   const opts = this.opts
//   this.config = new Config({ ...opts, logger: this.logger })
//
//   this.memoryStore = new InMemoryState(this.config.fileData.initialState)
//
//   this.handlers = new HandlerManager({ ...this })
//   this.fixtures = new FixtureManager({ ...this })
//
//   this.interactor = new Interactor({ ...this })
//   this.strapRouter = new Router({ ...this })
//
//   if (this.opts.watch) {
//     this.fileWatcher = chokidar.watch(this.config.modulesList, { ignoreInitial: true })
//     this.fileWatcher.on('change', () => { this.fileWatcher.close(); this.loadConfiguration() })
//   }
// }
