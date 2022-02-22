const path = require('path')
const Handlers = require('../Handlers')
const Fixtures = require('../Fixtures')
const InMemoryState = require('../InMemoryState')
const fs = require('fs')
const logger = require('../Logger')
const decache = require('decache')
const { loadDirectory } = require('./utils')

const defaultConfigDir = path.normalize(`.${path.sep}.appstrap`)

class Config {
  constructor ({ configDir = defaultConfigDir, watch = false } = {}) {
    const { fileList, map: configData } = loadDirectory(path.resolve(configDir))
    this.handlers = new Handlers(configData)
    // this.fixtures = new Fixtures(configData)
    // if (watch) {
    //
    // }
    console.log(this.handlers)
  }

  // how to do decaching with just the directory provided?
  // decache all of the entry points we pull for routes/fixtures ?
  // load () {
  // const filePath = path.join(this.metadata.configDir, this.metadata.configFileName)
  // if (!fs.existsSync(filePath)) {
  //   logger.error(`Config file not found at ${filePath}.  Please check or specify via the 'configPath' option.`)
  // } else {
  //   try { decache(filePath) } catch (e) {}
  //   this.processConfig(require(filePath))
  // }
  // }

  reload () { return this.load() }

  getModules () {
    return Object.keys(require.cache)
      .filter((path) => !path.includes('node_modules') && path.startsWith(process.cwd()))
  }

  processConfig (configData) {
    this.handlers.load(configData)
    this.fixtures.load(this.metadata.configDir)
  }
}

exports = module.exports = Config
