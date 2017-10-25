const http = require('http')
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
    return new Promise(resolve => {
      // fetch open port (update port if default or requested is not available)
      this.host = `http://localhost:${config.port}`
      this.server.listen(config.port, () => resolve())
    })
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

  loadPresets (presetArray) {
    const { config } = store.getState()
    try {
      const combinedPresetData = presetArray.reduce((dataObj, nextFileName) => {
        const mergeData = require(path.resolve(config.filePath, 'presets', nextFileName))
        return Object.assign(dataObj, mergeData.data)
      }, {})
      store.dispatch({type: 'SET_ROUTE_DATA', routeData: combinedPresetData})
    } catch (e) {
      throw('failed to load presets')
    }
  }

}

module.exports = Appstrap
