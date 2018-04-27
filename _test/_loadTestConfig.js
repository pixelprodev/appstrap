const path = require('path')
const locateProjectRoot = require('../src/utilities/locateProjectRoot')
const configLoader = require('../src/config/loader')

function loadTestConfig () {
  const projectRoot = locateProjectRoot()
  const dirParts = [projectRoot, '_test', '_testConfig', 'config.js']
  const filePath = dirParts.join(path.sep)
  return configLoader.load(filePath)
}

module.exports = loadTestConfig
