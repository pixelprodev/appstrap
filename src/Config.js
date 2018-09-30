const path = require('path')
const fs = require('fs')
const Endpoints = require('./Endpoints')
const Presets = require('./Presets')

class Config {
  constructor () {
    this.directory = this.detectConfig()
    this.data = require(path.join(this.directory, 'config.js'))
    this.validateData()
    this.endpoints = new Endpoints({data: this.data})
    this.presets = new Presets({directory: this.directory})
  }

  detectConfig (dir = process.cwd()) {
    const packageJsonExists = fs.existsSync(path.resolve(dir, 'package.json'))
    const appstrapFolderExists = fs.existsSync(path.resolve(dir, '.appstrap'))
    if (appstrapFolderExists) {
      return path.join(dir, '.appstrap')
    } else if (packageJsonExists || dir === '') {
      throw new Error('No configuration Found.  Please run appstrap init')
    } else {
      let splitDir = dir.split(path.sep)
      splitDir.pop()
      let goUpOneLevel = splitDir.join(path.sep)
      return this.detectConfig(goUpOneLevel)
    }
  }

  validateData () {

  }
}

module.exports = Config
