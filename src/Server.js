import express from 'express'
import bodyParser from 'body-parser'
import sleep from 'sleep-promise'
import http from 'http'
import util from 'util'
import getPort from 'get-port'
import Endpoints from './endpoints'
import Config from './config'
import managementInterface from '@pixelprodotco/appstrap-management-interface'
import { locateProjectRoot } from './utilities'
import Presets from './presets'
import path from 'path'

export class Server {
  constructor ({ endpoints, invokedFromCLI, port = 5000, presets }) {
    this.port = port
    this.endpoints = endpoints
    this.presets = presets

    // Bind methods
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)

    // Initialize express server
    this._app = express()
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({extended: true}))

    // Load Routes
    this._router = this.loadEndpoints()
    this._app.use((req, res, next) => this._router(req, res, next))

    this.httpServer = http.createServer(this._app)
    this.httpServer.listenAsync = util.promisify(this.httpServer.listen)
    this.httpServer.closeAsync = util.promisify(this.httpServer.close)
  }

  // configure ({port = 5000, isSPA = false, configData, endpoints, invokedFromCLI} = {}) {
  //   this.port = port
  //   this.isSPA = isSPA
  //   if (invokedFromCLI) {
  //     this.loadManagementInterface()
  //   }
  //   this._app.use((req, res, next) => this._router(req, res, next))
  //   this.loadEndpoints({endpoints})
  //   this.httpServer = http.createServer(this._app)
  //   this.httpServer.listenAsync = util.promisify(this.httpServer.listen)
  //   this.httpServer.closeAsync = util.promisify(this.httpServer.close)
  // }

  reloadEndpoints () { return this.loadEndpoints() }
  loadEndpoints () {
    const Router = express.Router({})
    const endpoints = this.endpoints._endpoints
    endpoints.forEach(({handler, method, path}, indx) => {
      Router[method](path,
        this.modifierMiddleware(endpoints[indx]),
        this.stateProviderMiddleware(),
        this.preHandlerMiddleware(endpoints[indx]),
        handler
      )
    })
    this._router = Router
    return Router
    // this.internalState = initialState
    // const Router = express.Router({})
    // const bundleIsDefined = (configData.bundle && Object.keys(configData.bundle).length > 0)
    // if (configData.assets && bundleIsDefined) { this.generateAssetEndpoints(Router) }
    // endpoints.forEach(({handler, method, path}, indx) => {
    //   Router[method](path,
    //     this.modifierMiddleware(endpoints[indx]),
    //     this.stateProviderMiddleware(),
    //     this.preHandlerMiddleware(endpoints[indx]),
    //     handler
    //   )
    // })
    // if (endpoints.length === 0 && !isSPA) { this.generateNoEndpointCatch(Router) }
    // if (isSPA) {
    //   const markup = this.getSpaHarnessMarkup(configData)
    //   Router.get('*', (req, res) => res.send(markup))
    // }
    // this._router = Router
    // return this._router
  }

  getSpaHarnessMarkup ({name, version, bundle: {host, webPath}} = Config.getConfigData()) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Appstrap | ${name} - ${version}</title>
      </head>
      <body>
        <div ${host.startsWith('#') ? 'id' : 'class'}="${host.substring(1, host.length)}"></div>
        <script src="${webPath}" type="text/javascript"></script>
      </body>
      </html>
    `
  }

  modifierMiddleware ({
    latency = false,
    latencyMS = 0,
    error = false,
    errorStatus = 500,
    delay = sleep
  }) {
    return async (req, res, next) => {
      if (latency) { await delay(latencyMS) }
      return error ? res.sendStatus(errorStatus) : next()
    }
  }

  stateProviderMiddleware () {
    return (req, res, next) => {
      req.state = this.internalState || {}
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

  generateNoEndpointCatch (Router) {
    const message = 'No endpoints have been defined.  Please check your config'
    Router.all('*', (req, res) => res.send(message))
    return message
  }

  generateAssetEndpoints (Router, configData = Config.getConfigData()) {
    const projectRoot = locateProjectRoot()
    configData.assets.forEach(asset => {
      Router.use(asset.webPath, express.static(path.normalize(`${projectRoot}${asset.directory}`)))
    })
  }

  loadManagementInterface () {
    this._app.use(managementInterface.configure({AppServer: this, Config, Endpoints, Presets}))
  }

  async start ({port = this.port} = {}) {
    this.port = await getPort({port})
    await this.httpServer.listenAsync(this.port)
    console.log(`
    ===============================================================
      Appstrap loaded successfully.
      A server has been started for you at the following address: 
      http://localhost:${this.port}
    ===============================================================
    `)
  }

  async stop () {
    await this.httpServer.closeAsync()
  }
}

export default Server
