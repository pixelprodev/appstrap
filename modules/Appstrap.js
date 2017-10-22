const AppServer = require('./AppServer')
const Config = require('../lib/Config')
const ManagementInterface = require('./ManagementInterface')
const vhost = require('vhost')

class Appstrap {
  constructor ({configPath, port, loadInterface = false} = {}) {
    this.config = new Config({configPath, port})
    this.loadInterface = loadInterface
    this._setupDefaultRouteModifiers()
  }

  start () {
    return new Promise(done => {
      this.appServer = new AppServer({routeModifiers: this.routeModifiers, config: this.config})
      if (this.loadInterface) {
        this.managementInterface = new ManagementInterface({
          appData: {appName: this.config.model.appName, appVersion: this.config.model.appVersion},
          routeModifiers: this.routeModifiers,
          setRouteModifier: this.setRouteModifier.bind(this)
        })
        this.appServer.app.use(vhost('appstrap.localhost', this.managementInterface.vhostApp))
      }
      this.appServer.serveBundle()
      this.appServer.start().then(() => {
        this.host = `http://localhost:${this.config.port}`
        done()
      })
    })
  }

  loadPreset (presetName) {
    return this.appServer.loadPreset(presetName)
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
      ['GET', 'POST', 'PUT', 'DELETE'].forEach(method => {
        if (route[method]) {
          thisRouteModifier[method] = modifierDefaults
        }
      })
      this.routeModifiers.push(thisRouteModifier)
    })
  }

  async reset () {
    await this.appServer.exit()
    this._setupDefaultRouteModifiers()
    await this.start()
  }

  exit () {
    return this.appServer.exit()
  }
}


module.exports = Appstrap
