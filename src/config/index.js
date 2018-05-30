import { ErrConfigInvalid, ErrConfigNotFound } from '../errors'
import { locateProjectRoot } from '../utilities'
import Endpoints from '../endpoints'
import fs from 'fs-extra'
import path from 'path'

export class Config {
  constructor ({
    configPath = path.join('.appstrap', 'config.js'),
    configData = this.load({ configPath })
  }) {
    this.configPath = configPath
    this.configDir = configPath.replace(/\/[^/]*$/, '')
    this.fileData = configData
    this.endpoints = new Endpoints({configData: this.fileData})
  }

  reload () {}
  load ({ configPath }) {
    this._ensureFileExists(configPath)
    return this._getConfigFileData({configPath})
  }

  _ensureFileExists (configFilePath) {
    if (!fs.existsSync(configFilePath)) {
      throw new ErrConfigNotFound(null, configFilePath)
    }
  }

  _getConfigFileData ({configPath, configData = require(path.resolve(configPath))}) {
    this._ensureFileIntegrity(configData)
    /* If a config file is set up to be a single page app, it will contain a bundle declaration
     * for those circumstances, we usually want to control the catch all route so it responds with the
     * html file that calls the bundle.  If the user wants to override that, they can, but we should warn
     * them not to. */
    if (configData.bundle && configData.endpoints.findIndex(e => e.path === '*') > -1) {
      this._warnAboutCatchAllEndpoint()
    }

    // Load name and version from package.json
    const projectRoot = locateProjectRoot()
    const { name, version } = require(path.join(projectRoot, 'package.json'))

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

export default Config
