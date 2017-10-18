const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const pug = require('pug')
const Net = require('net')
const openport = require('openport')

class AppServer {
  constructor ({routeModifiers, config}) {
    this.app = express()
    this.config = config
    this.routeModifiers = routeModifiers
    this._configureApp()
    this._serveStaticAssets()
    this._serveUserProvidedRoutes()
  }

  _configureApp () {
    this.app.set('view engine', 'pug')
    this.app.set('views', path.resolve(`${__dirname}/../lib/`))
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({extended: true}))
  }

  _serveStaticAssets () {
    this.config.model.assets.forEach(({urlPath, directory}) => {
      this.app.use(urlPath, express.static(path.resolve(this.config.configPath, directory)))
    })
  }

  routeStateMiddleware (req, res, next) {
    //todo assign state to req object
    next()
  }

  routeModifierMiddleware (req, res, next) {
    let method = req.method.toLowerCase()
    let endpoint = req.path
    let thisModifierGroup = this.routeModifiers.find(modifier => modifier.endpoint === endpoint)
    if (!thisModifierGroup) { return next() }
    let routeModifier = thisModifierGroup[method]
    if (routeModifier.latency) {
      return setTimeout(() => {
        return routeModifier.error ? res.sendStatus(500) : next()
      }, routeModifier.latencyMS)
    } else {
      return routeModifier.error ? res.sendStatus(500) : next()
    }
  }

  _serveUserProvidedRoutes () {
    const router = express.Router()
    this.config.model.routes.forEach(route => {
      ['get', 'post', 'put', 'delete'].forEach(method => {
        if (route[method]) {
          router[method](route.endpoint,
            this.routeModifierMiddleware.bind(this),
            this.routeStateMiddleware.bind(this),
            route[method])
        }
      })
    })
    this.app.use(router)
  }

  serveBundle () {
    //for the bundle, by default i want to just serve up a file from the config
    // optionally, a user should be able to provide a build flag and the path to their
    // webpack config - and we can build it for them in watch mode. (process sharing for docker container use case)
    this.app.get('*', (req, res) => res.render('index', this.config.model.bundle))

    //thoughts: if webpack bundling is enabled - compile to a temp directory for the file and serve that instead - ignore the directive in config.model if watch is enabled
  }


  start () {
    isPortTaken(this.config.port)
      .then(isAvailable => {
        if (isAvailable) {
          this.port = this.config.port
          this.app.listen(this.port, () => console.log(`listening on ${this.port}`))
        } else {
          openport.find((err, port) => {
            this.port = port
            this.app.listen(this.port, () => console.log(`listening on ${this.port}`))
          })
        }
      })
  }
}

module.exports = AppServer

const isPortTaken = (port) => new Promise((resolve, reject) => {
  const tester = Net.createServer()
    .once('error', err => (err.code == 'EADDRINUSE' ? resolve(false) : reject(err)))
    .once('listening', () => tester.once('close', () => resolve(true)).close())
    .listen(port)
})
