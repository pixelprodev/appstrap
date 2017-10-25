const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const pug = require('pug')
const store = require('./store')

class ManagementInterfaceConfig {
  constructor () {
    this.vhostApp = express()
    this._configurevhostApp()
    this._configureRoutes()
  }

  _configurevhostApp() {
    this.vhostApp.set('view engine', 'pug')
    this.vhostApp.set('views', path.resolve(`${__dirname}/../../views/`))
    this.vhostApp.use(express.static(path.resolve(`${__dirname}/../../interface/dist/`)))
    this.vhostApp.use(bodyParser.json())
    this.vhostApp.use(bodyParser.urlencoded({extended: true}))
  }

  _configureRoutes () {
    const { config, modifiers } = store.getState()
    const Router = express.Router()
    Router.route('/app-data').get((req, res) => {
      res.json({
        appName: config.appName,
        appVersion: config.appVersion,
        presets: [],
        routes: modifiers
      })
    })
    Router.route('/endpoint').put((req, res) => {
      const { endpoint, modifiers: {method, ...data} } = req.body
      store.dispatch({type: 'SET_MODIFIER_DATA', endpoint, method, data})
      res.sendStatus(200)
    })
    Router.route('/reload').get((req, res) => {
      res.sendStatus(200)
    })
    Router.route('*').get((req, res) => res.render('interface'))
    this.vhostApp.use(Router)
  }
}

module.exports = ManagementInterfaceConfig
