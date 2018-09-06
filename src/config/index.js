const { ErrConfigInvalid, ErrConfigNotFound } = require('../errors')
const Endpoints = require('../endpoints')
const fs = require('fs-extra')
const path = require('path')
const { locateProjectRoot } = require('../utilities')

class Config {
  constructor ({
    configPath = path.resolve(path.join('.appstrap', 'config.js')),
    configData = this.load({ configPath: path.resolve(configPath) }),
    warnAboutCatchAllEndpoint = this._warnAboutCatchAllEndpoint
  }) {
    this.configPath = path.resolve(configPath)
    this.configDir = this.configPath.replace(/\/[^/]*$/, '')
    this.fileData = configData
    this.endpoints = new Endpoints({configData})

    /*
    If a config file is set up to be a single page app, it will contain a bundle declaration
     for those circumstances, we usually want to control the catch all route so it responds with the
     html file that calls the bundle.  If the user wants to override that, they can, but we should warn
     them not to
    */
    if (configData.bundle && this.endpoints._endpoints.findIndex(e => e.path === '*') > -1) {
      warnAboutCatchAllEndpoint()
    }
  }

  update () {
    this.fileData = this.load({ configPath: this.configPath })
    this.endpoints.update({ fileData: this.fileData })
  }

  load ({ configPath }) {
    this._ensureFileExists(configPath)
    return this._getConfigFileData({configPath})
  }

  _ensureFileExists (configFilePath) {
    if (!fs.existsSync(configFilePath)) {
      throw new ErrConfigNotFound(null, configFilePath)
    }
  }

  _getConfigFileData ({
    configPath,
    configData = require(configPath, {useCache: false})
  }) {
    this._ensureFileIntegrity(configData)

    const { name, version } = require(path.join(locateProjectRoot(), 'package.json'))

    return {...configData, ...{name, version}}
  }

  _ensureFileIntegrity ({assets, endpoints}) {
    if (!assets || !endpoints) {
      throw new ErrConfigInvalid()
    }
  }

  _generateEndpointsFromConfig (baseConfigEndpoints) {
    this.endpoints.clear()
    baseConfigEndpoints.forEach(({path, ...methods}, indx) => {
      Object.keys(methods).forEach(method => {
        this.endpoints.addOne({path, method, handler: baseConfigEndpoints[indx][method]})
      })
    })
    return this.endpoints.fetch()
  }

  _warnAboutCatchAllEndpoint () {
    console.warn(`
    Your single page app config contains a wildcard endpoint ('*').
    By default, we create this endpoint for you and handle serving your bundle appropriately.
  `)
  }
}

module.exports = Config
