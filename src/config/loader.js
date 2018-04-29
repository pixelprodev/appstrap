import fs from 'fs-extra'
import path from 'path'
import Endpoints from '../endpoints'
import { ErrConfigInvalid, ErrConfigNotFound } from '../errors'
import { locateProjectRoot } from '../utilities'

export class Loader {
  constructor () {
    this.configFileData = {}
    this.configFilePath = '/.appstrap/config.js'
  }

  load (configFilePath = this.configFilePath) {
    this._ensureFileExists(configFilePath)
    this.configFileData = { ...this._getConfigFileData({configFilePath}), ...this._getPackageInfo() }
    this._generateEndpointsFromConfig(this.configFileData.endpoints)
    if (configFilePath !== this.configFilePath) {
      this.configFilePath = configFilePath
    }
    return {
      ...this.configFileData,
      ...{ endpoints: Endpoints.fetch() }
    }
  }

  _ensureFileExists (configFilePath) {
    if (!fs.existsSync(configFilePath)) {
      throw new ErrConfigNotFound(null, configFilePath)
    }
  }

  _ensureFileIntegrity ({bundle, assets, endpoints}) {
    if (!assets || !endpoints) {
      throw new ErrConfigInvalid()
    }
  }

  _getConfigFileData ({configFilePath, configData = require(path.resolve(configFilePath))}) {
    this._ensureFileIntegrity(configData)
    /* If a config file is set up to be a single page app, it will contain a bundle declaration
     * for those circumstances, we usually want to control the catch all route so it responds with the
     * html file that calls the bundle.  If the user wants to override that, they can, but we should warn
     * them not to. */
    if (configData.bundle && configData.endpoints.findIndex(e => e.path === '*') > -1) {
      this._warnAboutCatchAllEndpoint()
    }
    return configData
  }

  _getPackageInfo () {
    const projectRoot = locateProjectRoot()
    const { name, version } = require(`${projectRoot}${path.sep}package.json`)
    return { name, version }
  }

  _generateEndpointsFromConfig (baseConfigEndpoints) {
    Endpoints.clear()
    baseConfigEndpoints.forEach(({path, ...methods}, indx) => {
      Object.keys(methods).forEach(method => {
        Endpoints.addOne({path, method, handler: baseConfigEndpoints[indx][method]})
      })
    })
    return Endpoints.fetch()
  }

  _warnAboutCatchAllEndpoint () {
    console.warn(`
    Your single page app config contains a wildcard endpoint ('*').
    By default, we create this endpoint for you and handle serving your bundle appropriately.
  `)
  }
}

const singleton = new Loader()
export default singleton
