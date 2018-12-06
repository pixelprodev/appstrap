const path = require('path')
const fs = require('fs')
const Endpoints = require('./Endpoints')
const Presets = require('./Presets')
const MemoryState = require('./MemoryState')
const decache = require('decache')

class Config {
  constructor ({ useDirectory = this.detectConfig() } = {}) {
    this.directory = useDirectory
    this.load({ directory: this.directory })
    this.memoryState = new MemoryState({ initialState: this.data.initialState })
    this.endpoints = new Endpoints({ data: this.data })
    this.presets = new Presets({ memoryState: this.memoryState, directory: this.directory })
  }

  load () {
    decache(path.join(this.directory, 'config.js'))
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
}

module.exports = Config
