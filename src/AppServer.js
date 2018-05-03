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
    assets = Config.getConfigData().assets
  } = {}) {
    const Router = express.Router({})
    const projectRoot = locateProjectRoot()
    endpoints.forEach(({handler, method, path}, indx) => {
      Router[method](path,
        this.modifierMiddleware.bind(endpoints[indx]),
        handler
      )
    })
    if (this.isSPA) {
      Router.get('*', (req, res) => {
        res.send(this.getSpaHarnessMarkup().trim())
      })
    }
    assets.forEach(asset => {
      Router.use(asset.webPath, express.static(`${projectRoot}${asset.directory}`))
    })
    this._router = Router
    return this._router
  }

  getSpaHarnessMarkup () {
    const configData = Config.getConfigData()
    const { host, webPath } = configData.bundle
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Appstrap | ${configData.name} - ${configData.version}</title>
      </head>
      <body>
        <div ${host.startsWith('#') ? 'id' : 'class'}="${host.substring(1, host.length)}"></div>
        <script src="${webPath}" type="text/javascript"></script>
      </body>
      </html>
    `
  }

  async modifierMiddleware (req, res, next) {
    if (this.latency) {
      await sleep(this.latencyMS)
    }
    return this.error
      ? res.sendStatus(this.errorStatus)
      : next()
  }

  async start () {
    this.port = await getPort({port: this.port})
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

const singleton = new AppServer()
export default singleton
