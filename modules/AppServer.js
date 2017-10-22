const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const pug = require('pug')
const Net = require('net')
const openport = require('openport')
const http = require('http')

class AppServer {
  constructor ({routeModifiers, config}) {
    this.app = express()
    this.config = config
    this.routeModifiers = routeModifiers
    this.appState = {}
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

  routeStateProviderMiddleware (req, res, next) {
    let endpoint = req.path
    let method = req.method
    req.appState = this.appState
    req.storedEndpointResponse = (this.appState[endpoint] && this.appState[endpoint][method])
      ? this.appState[endpoint][method]
      : {}
    next()
  }

  routeStateUpdaterMiddleware (req, res, next) {
    let defaultResJson = res.json
    let endpoint = req.path
    let method = req.method

    res.json = (data) => {
      if (!this.appState[endpoint]) { this.appState[endpoint] = {} }
      if (!this.appState[endpoint][method]) { this.appState[endpoint][method] = {} }
      this.appState[endpoint][method] = data
      defaultResJson.call(res, data)
    }

    next()
  }

  routeModifierMiddleware (req, res, next) {
    let method = req.method
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
      ['GET', 'POST', 'PUT', 'DELETE'].forEach(method => {
        if (route[method]) {
          router[method.toLowerCase()](route.endpoint,
            this.routeStateProviderMiddleware.bind(this),
            this.routeModifierMiddleware.bind(this),
            this.routeStateUpdaterMiddleware.bind(this),
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
    return new Promise(resolve => {
      isPortTaken(this.config.port)
        .then(isAvailable => new Promise(goNext => {
          if (!isAvailable) {
            openport.find((err, port) => {
              this.config.port = port
              goNext()
            })
          } else {
            goNext()
          }
        }))
        .then(() => {
          this.serverInstance = http.createServer(this.app)
          this.serverInstance.listen(this.config.port, () => { resolve() })
        })
    })
  }

  exit () {
    return new Promise(resolve => {
      this.serverInstance.close(() => resolve())
    })
  }

  loadPreset (presetName) {
    try {
      const preset = require(path.resolve(this.config.configPath, 'presets', presetName))
      this.appState = preset.data
    } catch (e) {
      throw('failed to load preset')
    }
  }

  loadPresets (presetArray) {
    try {
      const combinedPresetData = presetArray.reduce((dataObj, nextFileName) => {
        const mergeData = require(path.resolve(this.config.configPath, 'presets', nextFileName))
        return Object.assign(dataObj, mergeData.data)
      }, {})
      this.appState = combinedPresetData
    } catch (e) {
      throw('failed to load presets')
    }
  }
}

module.exports = AppServer

const isPortTaken = (port) => new Promise((resolve, reject) => {
  const tester = Net.createServer()
    .once('error', err => (err.code == 'EADDRINUSE' ? resolve(false) : reject(err)))
    .once('listening', () => tester.once('close', () => resolve(true)).close())
    .listen(port)
})
