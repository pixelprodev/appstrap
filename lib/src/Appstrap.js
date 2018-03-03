const http = require('http')
const ServerConfig = require('./ServerConfig')
const path = require('path')
const store = require('./store')
const Net = require('net')
const openport = require('openport')

class Appstrap {
  constructor ({configPath, port, invokedFromCLI = false} = {}) {
    store.dispatch({type: 'LOAD_CONFIG', configPath, port})
    store.dispatch({type: 'SET_DEFAULTS'})
    let { app } = new ServerConfig(invokedFromCLI)
    this.server = http.createServer(app)
  }

  async start () {
    await this._ensurePortIsOpen()
    const { config } = store.getState()
    this.host = `http://localhost:${config.port}`
    return new Promise(resolve => {
      this.server.listen(config.port, () => {
        console.log(`Listening on port : ${config.port}`)
        resolve()
      })
    })
  }

  _ensurePortIsOpen() {
    return new Promise((resolve, reject) => {
      const { config } = store.getState()
      isPortTaken(config.port)
      .then(portIsOpen => {
        if (!portIsOpen) {
          openport.find((err, port) => {
            store.dispatch({type: 'OVERRIDE_CONFIG_PORT', port})
            resolve()
          })
        } else {
          resolve()
        }
      })
      .catch(reject)
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

const isPortTaken = (port) => new Promise((resolve, reject) => {
  const tester = Net.createServer()
    .once('error', err => (err.code == 'EADDRINUSE' ? resolve(false) : reject(err)))
    .once('listening', () => tester.once('close', () => resolve(true)).close())
    .listen(port)
})

module.exports = Appstrap
