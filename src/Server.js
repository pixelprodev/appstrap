const express = require('express')
const bodyParser = require('body-parser')
const sleep = require('sleep-promise')
const http = require('http')
const util = require('util')
const detectPort = require('detect-port')
const ManagementInterface = require('./management-interface')
const { locateProjectRoot } = require('./utilities')
const path = require('path')
const chalk = require('chalk')
const State = require('./State')

class Server {
  constructor ({ config, invokedFromCLI = false, port = 5000, presets }) {
    this.port = port
    this.endpoints = config.endpoints
    this.presets = presets
    this.enableManagementInterface = invokedFromCLI
    this.state = new State({initialState: config.fileData.initialState})

    // Bind methods
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)

    // Initialize express server
    this._app = express()
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({extended: true}))

    if (this.enableManagementInterface) {
      const managementInterface = new ManagementInterface({ config, server: this, presets })
      this._app.use(managementInterface.middleware)
    }

    // Load Routes
    this._router = this.loadEndpoints({config})
    this._app.use((req, res, next) => this._router(req, res, next))

    this.httpServer = http.createServer(this._app)
    this.httpServer.listenAsync = util.promisify(this.httpServer.listen)
  }

  reloadEndpoints ({config}) { return this.loadEndpoints({config}) }
  loadEndpoints ({config}) {
    const Router = express.Router({})
    const endpoints = this.endpoints._endpoints
    const projectRoot = locateProjectRoot()
    config.fileData.assets.forEach(asset => {
      Router.use(asset.webPath, express.static(path.normalize(`${projectRoot}/${asset.directory}`)))
    })
    endpoints.forEach(({handler, method, path}, indx) => {
      Router[method](path,
        this.modifierMiddleware(endpoints[indx]),
        this.stateProviderMiddleware(),
        this.preHandlerMiddleware(endpoints[indx]),
        handler
      )
    })
    if (this.endpoints.enableClientSideRouting) {
      Router.use(this.endpoints.clientSideRoutingEndpoint)
    } else {
      if (this.endpoints._endpoints.length === 0) {
        Router.all('*', (req, res) => res.send('no endpoints defined'))
      }
    }
    this._router = Router
    return Router
  }

  modifierMiddleware ({ latency = false, latencyMS = 0, error = false, errorStatus = 500, delay = sleep }) {
    return async (req, res, next) => {
      if (latency) { await delay(latencyMS) }
      return error ? res.sendStatus(errorStatus) : next()
    }
  }

  stateProviderMiddleware () {
    return (req, res, next) => {
      req.state = res.state = this.state.getState()
      req.setState = res.setState = this.state.setState
      next()
    }
  }

  preHandlerMiddleware ({ path, method }) {
    return (req, res, next) => {
      const defaultResJSON = res.json
      res.json = this.interceptJsonResponse({res, path, method, defaultResJSON})
      next()
    }
  }

  interceptJsonResponse ({res, defaultResJSON, path, method, preset = this.presets.fetch({path, method})}) {
    return (data) => {
      if (preset !== -1) {
        data = preset.mode === 'merge' ? {...data, ...preset.data} : preset.data
      }
      defaultResJSON.call(res, data)
    }
  }

  async start ({port = this.port} = {}) {
    const checkedPort = await detectPort(port)
    this.port = checkedPort
    await this.httpServer.listenAsync(this.port)
    /*
     If the server was invoked from CLI, we want to show a confirmation message when the server
      is started.  We will also indicate the management interface port to make people more aware
      that it exists.
    */
    if (this.enableManagementInterface) {
      console.log(chalk`
      ===============================================================
        {yellow.bold Appstrap} loaded {green successfully}.
        A server has been started for you at the following address: 
        {blue http://localhost:${this.port}}

        The management interface can be found at the following address:
        {blue http://appstrap.localhost:${this.port}}
      ===============================================================
    `)
    }
  }

  stop () {
    return new Promise((resolve) => {
      this.httpServer.listening
        ? this.httpServer.close(() => resolve())
        : resolve()
    })
  }
}

module.exports = Server
