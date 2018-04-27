const path = require('path')
const locateProjectRoot = require('../utilities/locateProjectRoot')
const configLoader = require('../config/loader')

function loadTestConfig () {
  const projectRoot = locateProjectRoot()
  const dirParts = [projectRoot, 'src', '_test', '_testConfig', 'config.js']
  const filePath = dirParts.join(path.sep)
  return configLoader.load(filePath)
}

module.exports = loadTestConfig
