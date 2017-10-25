const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const pug = require('pug')
const sleep = require('sleep-promise')
const store = require('./store')
const vhost = require('vhost')
const ManagementInterfaceConfig = require('./ManagementInterfaceConfig')

class ServerConfig {
  constructor (invokedFromCLI) {
    this.app = express()
    const { config } = store.getState()

    this._configureApp()
    this._configureStatics(config)
    this._configureRoutes(config)
    if (invokedFromCLI) {
      this._configureManagementInterface()
    }
    this._configureBundle(config)
  }

  _configureApp() {
    this.app.set('view engine', 'pug')
    this.app.set('views', path.resolve(`${__dirname}/../../views/`))
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({extended: true}))
  }

  _configureStatics({assets, filePath}) {
    assets.forEach(({urlPath, directory}) => {
      this.app.use(urlPath, express.static(path.resolve(filePath, directory)))
    })
  }

  _configureRoutes({routes}) {
    const router = express.Router()
    routes.forEach(route => {
      ['GET', 'POST', 'PUT', 'DELETE'].forEach(method => {
        if (route[method]) {
          router[method.toLowerCase()](route.endpoint,
            this.stateProviderMiddleware,
            this.modifierMiddleware,
            this.stateUpdaterMiddleware,
            route[method])
        }
      })
    })
    this.app.use(router)
  }

  _configureManagementInterface () {
    const { vhostApp } = new ManagementInterfaceConfig()
    this.app.use(vhost('appstrap.localhost', vhostApp))
  }

  _configureBundle ({bundle}) {
    this.app.get('*', (req, res) => res.render('host', bundle))
  }

  stateProviderMiddleware (req, res, next) {
    let { path, method } = req
    let { routeData } = store.getState()
    req.state = routeData
    req.storedEndpointResponse = (routeData[path] && routeData[path][method])
      ? routeData[path][method]
      : {}
    next()
  }
  
  stateUpdaterMiddleware (req, res, next) {
    let defaultResJson = res.json
    let { path, method } = req
    let { routeData } = store.getState()

    res.json = (data) => {
      if (!routeData[path]) { routeData[path] = {} }
      if (!routeData[path][method]) { routeData[path][method] = {} }
      routeData[path][method] = data
      defaultResJson.call(res, data)
    }
    next()
  }
  
  async modifierMiddleware (req, res, next) {
    let { path, method } = req
    let { modifiers } = store.getState()
    let thisModifierGroup = modifiers.find(modifier => modifier.endpoint === path)
    if (!thisModifierGroup) { return next() }
    let modifier = thisModifierGroup[method]
    if (modifier.latency) {
      await sleep(modifier.latencyMS)
    }
    return modifier.error ? res.sendStatus(500) : next()
  }
}

module.exports = ServerConfig
