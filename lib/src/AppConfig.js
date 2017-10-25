const path = require('path')

class AppConfig {
  constructor ({configPath = './.appstrap/config.js', port = 5000}) {
    this.port = port
    const rootPath = path.resolve(process.cwd(), configPath).split('/')
    this.fileName = rootPath.reverse().shift()
    this.filePath = rootPath.reverse().join('/')
    this._load()
    this._validate()
    this._loadAppInfo()
  }

  _load () {
    try {
      const configData = require(`${this.filePath}/${this.fileName}`)
      for (let key in configData) {
        if (configData.hasOwnProperty(key))
        this[key] = configData[key]
      }
    } catch (e) {
      console.log(e)
      console.log(`
        Unable to load config file at ${this.filePath}/${this.fileName}.  
        Please provide a valid configuration file to proceed
      `)
      process.exit()
    }
  }

  _validate () {
    if (!this.bundle || !this.assets || !this.routes) {
      console.log(`
        You are missing crucial config data.  
        Please ensure bundle, assets, and routes are specified to proceed.
      `)
      process.exit()
    }
  }

  _loadAppInfo () {
    try {
      const {name, version} = require(path.resolve(`${this.filePath}/../package.json`))
      this.appName = name
      this.appVersion = version
    } catch (e) {}
  }

}

module.exports = AppConfig
