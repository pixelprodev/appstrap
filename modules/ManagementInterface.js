const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const pug = require('pug')

class ManagementInterface {
  constructor ({appData, routeModifiers, setRouteModifier}) {
    this.vhostApp = express()
    this.routes = routeModifiers
    this.configureVhostApp()
    this.registerHandlers(appData, setRouteModifier)
  }

  configureVhostApp () {
    this.vhostApp.set('view engine', 'pug')
    this.vhostApp.set('views', path.resolve(`${__dirname}/../interface/dist/`))
    this.vhostApp.use(express.static(path.resolve(`${__dirname}/../interface/dist/`)))
    this.vhostApp.use(bodyParser.json())
    this.vhostApp.use(bodyParser.urlencoded({extended: true}))
  }

  registerHandlers (appData, setRouteModifier) {
    const Router = express.Router()
    Router.route('/app-data').get((req, res) => {
      res.json({
        appName: appData.appName,
        appVersion: appData.appVersion,
        presets: [],
        routes: this.routes
      })
    })
    Router.route('/endpoint').put((req, res) => {
      const { endpoint, method, modifiers } = req.body
      delete modifiers.method
      console.log('got here at endpoint')
      setRouteModifier(endpoint, method, modifiers)
      res.sendStatus(200)
    })
    Router.route('/reload').get((req, res) => {
      res.sendStatus(200)
    })
    this.vhostApp.use(Router)
  }
}

module.exports = ManagementInterface
