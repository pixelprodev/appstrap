import path from 'path'
import { locateProjectRoot } from '../src/utilities'
import configLoader from '../src/config/loader'

function loadTestConfig () {
  const projectRoot = locateProjectRoot()
  const dirParts = [projectRoot, '_test', '_testConfig', 'config.js']
  const filePath = dirParts.join(path.sep)
  return configLoader.load(filePath)
}

export default loadTestConfig
