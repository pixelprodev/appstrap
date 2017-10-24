const http = require('http')
const util = require('util')
const ServerConfig = require('./ServerConfig')
const path = require('path')
const store = require('./store')

class Appstrap {
  constructor ({configPath, port, invokedFromCLI = false} = {}) {
    store.dispatch({type: 'LOAD_CONFIG', configPath, port})
    store.dispatch({type: 'SET_DEFAULTS'})
    let { app } = new ServerConfig(invokedFromCLI)
    this.server = http.createServer(app)
  }

  async start () {
    const { config } = store.getState()
    this.server.listen = util.promisify(this.server.listen)
    // fetch open port (update port if default or requested is not available)
    this.host = `http://localhost:${config.port}`
    await this.server.listen(config.port)
  }

  reset () {
    store.dispatch({type: 'SET_DEFAULTS'})
  }

  async stop () {
    await this.server.close()
  }

  setModifier (endpoint, method, data) {
    store.dispatch({type: 'SET_MODIFIER_DATA', endpoint, method, data})
  }

  loadPreset (presetName) {
    const { config } = store.getState()
    try {
      const { data } = require(path.resolve(config.filePath, 'presets', presetName))
      store.dispatch({type: 'SET_ROUTE_DATA', routeData: data})
    } catch (e) {
      throw('failed to load preset')
    }
  }

  loadPresets () {}

}

module.exports = Appstrap
