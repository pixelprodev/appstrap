import express from 'express'
import bodyParser from 'body-parser'
import sleep from 'sleep-promise'
import http from 'http'
import util from 'util'
import getPort from 'get-port'
import Endpoints from './endpoints'

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

  configure ({port, isSPA}) {
    this.port = port
    this.isSPA = isSPA
    this.loadEndpoints(Endpoints.fetch())
  }

  reloadEndpoints (endpoints) { this.loadEndpoints(endpoints) }
  loadEndpoints (endpoints) {
    const Router = express.Router({})
    endpoints.forEach(({handler, method, path}, indx) => {
      Router[method](path,
        this.modifierMiddleware.bind(endpoints[indx]),
        handler
      )
    })
    // TODO load default route here if single page app
    this._router = Router
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
