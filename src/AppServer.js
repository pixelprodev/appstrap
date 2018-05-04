import express from 'express'
import bodyParser from 'body-parser'
import sleep from 'sleep-promise'
import http from 'http'
import util from 'util'
import getPort from 'get-port'
import Endpoints from './endpoints'
import Config from './config/loader'
import { locateProjectRoot } from './utilities'

export class AppServer {
  constructor () {
    this._app = express()

    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({extended: true}))

    this._loadDefaultRouter()
    this._app.use((req, res, next) => this._router(req, res, next))
    this.httpServer = http.createServer(this._app)
    this.httpServer.listenAsync = util.promisify(this.httpServer.listen)
    this.httpServer.closeAsync = util.promisify(this.httpServer.close)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
  }

  _loadDefaultRouter () {
    const Router = express.Router({})
    Router.get('*', (req, res) => res.send('Welcome to appstrap!'))
    this._router = Router
  }

  configure ({port = 5000, isSPA = false} = {}) {
    this.port = port
    this.isSPA = isSPA
    this.loadEndpoints()
  }

  reloadEndpoints (args) { this.loadEndpoints(args) }
  loadEndpoints ({
    endpoints = Endpoints.fetch(),
    configData = Config.getConfigData(),
    isSPA = this.isSPA
  } = {}) {
    const Router = express.Router({})
    const bundleIsDefined = Object.keys(configData.bundle).length > 0
    endpoints.forEach(({handler, method, path}, indx) => {
      Router[method](path,
        this.getModifierMiddleware(endpoints[indx]),
        handler
      )
    })
    if (endpoints.length === 0 && !isSPA) { this.generateNoEndpointCatch(Router) }
    if (isSPA) {
      const markup = this.getSpaHarnessMarkup(configData)
      Router.get('*', (req, res) => res.send(markup))
    }
    if (configData.assets && bundleIsDefined) { this.generateAssetEndpoints(Router) }
    this._router = Router
    return this._router
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

  getModifierMiddleware ({
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

  generateNoEndpointCatch (Router) {
    const message = 'No endpoints have been defined.  Please check your config'
    Router.all('*', (req, res) => res.send('No endpoints have been defined.  Please check your config'))
    return message
  }

  generateAssetEndpoints (Router, {configData = Config.getConfigData()} = {}) {
    const projectRoot = locateProjectRoot()
    configData.assets.forEach(asset => {
      Router.use(asset.webPath, express.static(`${projectRoot}${asset.directory}`))
    })
  }

  async start ({port = this.port}) {
    this.port = await getPort({port})
    await this.httpServer.listenAsync(port)
    console.log(`
    ===============================================================
      Appstrap loaded successfully.
      A server has been started for you at the following address: 
      http://localhost:${port}
    ===============================================================
    `)
  }

  async stop () {
    await this.httpServer.closeAsync()
  }
}

const singleton = new AppServer()
export default singleton
