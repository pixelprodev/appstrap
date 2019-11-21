const path = require('path')
const fs = require('fs')
const decache = require('decache')

class Config {
  constructor ({ config = './.appstrap/config.js', events, logger } = {}) {
    const [configFile, ...configPathParts] = config.split(path.sep).reverse()
    this.logger = logger
    this.configFile = configFile
    this.configPath = path.join(process.cwd(), configPathParts.reverse().join(path.sep))
    this.source = path.join(this.configPath, this.configFile)
    this.events = events
    this.fileData = {}
    // trigger load
    this.load()
  }

  load () {
    if (!fs.existsSync(this.source)) {
      this.logger.error(`Config file not found at ${this.source}.  Please check or specify via the 'config' option.`)
    } else {
      decache(this.source)
      this.fileData = require(this.source)
    }
    this.events.emit('config::load', this.fileData)
  }
}

exports = module.exports = Config
