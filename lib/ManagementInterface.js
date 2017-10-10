const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const pug = require('pug')


class ManagementInterface {
  constructor (config) {
    this.setRouteModifierDefaults(config)
    this.vhostApp = express()
    this.configureVhostApp()
    this.registerHandlers(config)
  }

  configureVhostApp () {
    this.vhostApp.set('view engine', 'pug')
    this.vhostApp.set('views', path.resolve(`${__dirname}/../interface/dist/`))
    this.vhostApp.use(express.static(path.resolve(`${__dirname}/../interface/dist/`)))
    this.vhostApp.use(bodyParser.json())
    this.vhostApp.use(bodyParser.urlencoded({extended: true}))
  }

  setRouteModifierDefaults (config) {
    this.routes = []
    const modifierDefaults = {latency: false, latencyMS: 0, error: false}
    config.model.routes.forEach(route => {
      let thisRoute = {endpoint: route.endpoint};
      ['get', 'post', 'put', 'delete'].forEach(method => {
        if (route[method]) {
          thisRoute[method] = modifierDefaults
        }
      })
      this.routes.push(thisRoute)
    })
  }

  registerHandlers (config) {
    const Router = express.Router()
    Router.route('/endpoints').get((req, res) => {
      res.json({
        appName: config.model.appName,
        appVersion: config.model.appVersion,
        presets: [],
        routes: this.routes
      })
    })
    Router.route('/endpoint').put((req, res) => {
      const { routeId } = req.body
      this.routes[routeId] = Object.assign({}, this.routes[routeId], req.body)
      res.send(200)
    })
    this.vhostApp.use(Router)
  }
}

module.exports = ManagementInterface
