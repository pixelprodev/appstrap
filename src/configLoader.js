const fs = require('fs-extra')
const path = require('path')
const locateProjectRoot = require('./helpers/locate-project-root')
const { ErrConfigNotFound, ErrConfigInvalid } = require('./errors')
const Endpoint = require('./Endpoint')

function load (configFilePath = './.appstrap/config.js') {
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
  if (!bundle || !assets || !endpoints) {
    throw new ErrConfigInvalid()
  }
}

function _getConfigFileData ({configFilePath, configData = require(configFilePath)}) {
  _ensureFileIntegrity(configData)
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

module.exports = {
  load,
  _test: {
    _ensureFileExists,
    _ensureFileIntegrity,
    _getConfigFileData,
    _getPackageInfo
  }
}
