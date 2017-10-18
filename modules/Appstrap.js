const AppServer = require('./AppServer')
const Config = require('../lib/Config')
const ManagementInterface = require('./ManagementInterface')
const vhost = require('vhost')

class Appstrap {
  constructor ({configPath, port}) {
    this.configPath = configPath
    this.port = port
    this.config = new Config({configPath: this.configPath, port: this.port})
    this._setupDefaultRouteModifiers()
  }

  start () {
    this.appServer = new AppServer({routeModifiers: this.routeModifiers, config: this.config})
    this.managementInterface = new ManagementInterface({
      appData: {appName: this.config.model.appName, appVersion: this.config.model.appVersion},
      routeModifiers: this.routeModifiers,
      setRouteModifier: this.setRouteModifier.bind(this)
    })
    this.appServer.app.use(vhost('appstrap.localhost', this.managementInterface.vhostApp))
    this.appServer.serveBundle()
    this.appServer.start()
    this.host = `http://localhost:${this.appServer.port}`
  }

  setRouteModifier (endpoint, method, propValue) {
    const thisModifier = this.routeModifiers.find(modifier => modifier.endpoint === endpoint)
    thisModifier[method] = Object.assign({}, thisModifier[method], propValue)
  }

  _setupDefaultRouteModifiers () {
    this.routeModifiers = []
    const modifierDefaults = {latency: false, latencyMS: 0, error: false}
    this.config.model.routes.forEach(route => {
      let thisRouteModifier = {endpoint: route.endpoint};
      ['get', 'post', 'put', 'delete'].forEach(method => {
        if (route[method]) {
          thisRouteModifier[method] = modifierDefaults
        }
      })
      this.routeModifiers.push(thisRouteModifier)
    })
  }

  exit () {
    process.exit()
  }
}


module.exports = Appstrap
