const path = require('path')
const fs = require('fs')
const decache = require('decache')

class Config {
  constructor ({ config = './.appstrap/config.js', logger } = {}) {
    const [configFile, ...configPathParts] = config.split(path.sep).reverse()
    this.logger = logger
    this.configFile = configFile
    this.configPath = path.join(process.cwd(), configPathParts.reverse().join(path.sep))
    this.source = path.join(this.configPath, this.configFile)
    this.fileData = {}
    // trigger load
    this.load()
    this.modulesList = this.getModules()
  }

  load () {
    if (!fs.existsSync(this.source)) {
      this.logger.error(`Config file not found at ${this.source}.  Please check or specify via the 'config' option.`)
    } else {
      decache(this.source)
      this.fileData = require(this.source)
    }
  }

  getModules () {
    return Object.keys(require.cache)
      .filter((path) => !path.includes('node_modules') && path.startsWith(process.cwd()))
  }
}

exports = module.exports = Config
