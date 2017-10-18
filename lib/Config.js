const path = require('path')

class Config {
  constructor ({configPath = './.appstrap/config.js', port = 5000}) {
    this.port = port
    const fullConfigPath = path.resolve(process.cwd(), configPath).split('/')
    this.configFile = fullConfigPath.reverse().shift()
    this.configPath = fullConfigPath.reverse().join('/')
    this.loadConfigModel()
    this.validateConfig()
    this.loadAppInformation()
  }

  loadConfigModel () {
    try {
      this.model = require(`${this.configPath}/${this.configFile}`)
      this.model.initialState = this.model.initialState || {}
    } catch (e) {
      console.log(e)
      console.log(`
        Unable to load config file at ${this.configPath}/${this.configFile}.  
        Please provide a valid configuration file to proceed
      `)
      process.exit()
    }
  }

  validateConfig () {
    if (!this.model.bundle || !this.model.assets || !this.model.routes) {
      console.log(`
        You are missing crucial config data.  
        Please ensure bundle, assets, and routes are specified to proceed.
      `)
      process.exit()
    }
  }

  loadAppInformation () {
    try {
      const pkgInfo = require(`${this.configPath}/package.json`)
      this.model.appName = pkgInfo.name
      this.model.appVersion = pkgInfo.version
    } catch (e) {}
  }
}

module.exports = Config
