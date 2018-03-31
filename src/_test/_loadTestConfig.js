const path = require('path')
const locateProjectRoot = require('../helpers/locate-project-root')
const configLoader = require('../configLoader')

function loadTestConfig () {
  const projectRoot = locateProjectRoot()
  const dirParts = [projectRoot, 'src', '_test', '_testConfig', 'config.js']
  const filePath = dirParts.join(path.sep)
  return configLoader.load(filePath)
}

module.exports = loadTestConfig