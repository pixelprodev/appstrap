const fs = require('fs-extra')
const path = require('path')
const locateProjectRoot = require('./helpers/locate-project-root')
const { ErrConfigNotFound, ErrConfigInvalid } = require('./errors')

function load (configFilePath = './.appstrap/config.js') {
  _ensureFileExists(configFilePath)
  return {
    ..._getConfigFileData({configFilePath}),
    ..._getPackageInfo()
  }
}

function _ensureFileExists (configFilePath) {
  if (!fs.existsSync(configFilePath)) {
    throw new ErrConfigNotFound(null, configFilePath)
  }
}

function _ensureFileIntegrity ({bundle, assets, routes}) {
  if (!bundle || !assets || !routes) {
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

module.exports = {
  load,
  _test: {
    _ensureFileExists,
    _ensureFileIntegrity,
    _getConfigFileData,
    _getPackageInfo
  }
}
