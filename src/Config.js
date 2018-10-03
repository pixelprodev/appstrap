const path = require('path')
const fs = require('fs')
const Endpoints = require('./Endpoints')
const Presets = require('./Presets')

class Config {
  constructor () {
    console.log('initializing directory')
    this.directory = this.detectConfig()
    console.log('config found at ' + this.directory)
    this.load({ directory: this.directory })
    this.validateData()
    console.log(this.data)
    this.endpoints = new Endpoints({ data: this.data })
    this.presets = new Presets({ directory: this.directory })
  }

  load ({ directory }) {
    this.package = require(path.join(directory, '..', 'package.json'))
    this.data = require(path.join(this.directory, 'config.js'))
  }

  detectConfig (dir = process.cwd()) {
    const packageJsonExists = fs.existsSync(path.join(dir, 'package.json'))
    const appstrapFolderExists = fs.existsSync(path.join(dir, '.appstrap'))
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
