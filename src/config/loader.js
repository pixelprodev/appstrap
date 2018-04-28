const fs = require('fs-extra')
const path = require('path')
const locateProjectRoot = require('../utilities/locateProjectRoot')
const { ErrConfigNotFound, ErrConfigInvalid } = require('../errors')
const Endpoint = require('../endpoints/Endpoint')

function load (configFilePath = '/.appstrap/config.js') {
  _ensureFileExists(configFilePath)
  const configFileData = _getConfigFileData({configFilePath})
  const endpoints = _generateEndpointsFromConfig(configFileData.endpoints)
  return {
    configFilePath,
    ...configFileData,
    ..._getPackageInfo(),
    endpoints
  }
}

function _ensureFileExists (configFilePath) {
  if (!fs.existsSync(configFilePath)) {
    throw new ErrConfigNotFound(null, configFilePath)
  }
}

function _ensureFileIntegrity ({bundle, assets, endpoints}) {
  if (!assets || !endpoints) {
    throw new ErrConfigInvalid()
  }
}

function _getConfigFileData ({configFilePath, configData = require(path.resolve(configFilePath))}) {
  _ensureFileIntegrity(configData)
  /* If a config file is set up to be a single page app, it will contain a bundle declaration
   * for those circumstances, we usually want to control the catch all route so it responds with the
   * html file that calls the bundle.  If the user wants to override that, they can, but we should warn
   * them not to. */
  if (configData.bundle && configData.endpoints.findIndex(e => e.path === '*') > -1) {
    _warnAboutCatchAllEndpoint()
  }
  return configData
}

function _getPackageInfo () {
  const projectRoot = locateProjectRoot()
  const { name, version } = require(`${projectRoot}${path.sep}package.json`)
  return { name, version }
}

function _generateEndpointsFromConfig (baseConfigEndpoints) {
  const endpoints = []
  baseConfigEndpoints.forEach(({path, ...methods}, indx) => {
    Object.keys(methods).forEach(method => {
      endpoints.push(new Endpoint({path, method, handler: baseConfigEndpoints[indx][method]}))
    })
  })
  return endpoints.sort((a, b) => b.path.length - a.path.length)
}

function _warnAboutCatchAllEndpoint () {
  console.warn(`
    Your single page app config contains a wildcard endpoint ('*').
    By default, we create this endpoint for you and handle serving your bundle appropriately.
  `)
}

module.exports = {
  load,
  _test: {
    _ensureFileExists,
    _ensureFileIntegrity,
    _getConfigFileData,
    _getPackageInfo,
    _generateEndpointsFromConfig
  }
}
