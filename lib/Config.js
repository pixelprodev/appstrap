const path = require('path')
const fs = require('fs')
const glob = require('glob')

class Config {
  constructor (configDir, logger) {
    this.absConfigDir = path.resolve(configDir)
    this.logger = logger

    if (!fs.existsSync(this.absConfigDir)) {
      this.logger.error(`no configuration found at ${this.absConfigDir}`)
    }

    this.loadFiles()
  }

  loadFiles () {
    this.files = glob.sync(`${this.absConfigDir}/**/*`, { nodir: true, nosort: true }).reverse()
    const initialStateFile = this.files.find(file => file.includes('initialState'))
    this.initialState = initialStateFile ? require(initialStateFile) : {}
  }

  update () {
    this.loadFiles()
  }
}

module.exports = exports = Config
