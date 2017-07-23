const bodyParser = require('body-parser')
const Config = require('./Config')
const express = require('express')
const path = require('path')
const pug = require('pug')
const sleep = require('sleep-promise')

class Server {
  static start ({configPath, port}) {
    this.config = new Config({configPath, port})
    this.app = express()
    this.state = this.config.model.initialState
    this.configureExpressApp(this.app)
    this.serveUserProvidedRoutes()
    this.serveUserProvidedAssets()
    this.serveBundle()
    this.app.listen(this.config.port, console.log(`Server is now live on port ${this.config.port}`))
  }

  static configureExpressApp(app) {
    app.set('view engine', 'pug')
    app.set('views', path.resolve(__dirname))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
  }

  static serveUserProvidedRoutes () {
    this.routeModifiers = {}
    const modifierDefaults = {latency: false, latencyMS: 0, error: false}
    const router = express.Router()
    this.config.model.routes.forEach(route => {
      ['get', 'post', 'put', 'delete'].forEach(method => {
        if (route[method]) {
          const identifier = `${method}::${route.endpoint}`
          this.routeModifiers[identifier] = modifierDefaults
          const routeModifier = this.routeModifiers[identifier]
          router[method](route.endpoint, async (req, res, next) => {
            if (routeModifier.latency) { await sleep(routeModifier.latencyMS) }
            if (routeModifier.error) return res.sendStatus(500)
            req.state = this.state
            return route[method](req, res, next)
          })
        }
      })
    })
    this.app.use(router)
  }

  static serveUserProvidedAssets () {
    const { app, config } = this
    config.model.assets.forEach(({urlPath, directory}) => {
      app.use(urlPath, express.static(path.resolve(config.configPath, directory)))
    })
  }

  static serveBundle () {
    const { app, config } = this
    app.get('*', (req, res) => res.render('index', config.model.bundle))
  }
}

module.exports = Server