const path = require('path')

class AppstrapConfig {
  constructor ({configPath = './appstrap.config.js', port = 5000}) {
    this.port = port
    this.configPath = configPath
    this.loadConfigModel()
    this.validateConfig()
  }

  loadConfigModel () {
    try {
      this.model = require(path.resolve(__dirname, '../', this.configPath))
    } catch (e) {
      console.log(`
        Unable to load config file at ${this.configPath}.  
        Please provide a valid configuration file to proceed
      `)
      process.exit()
    }
  }

  validateConfig () {
    // todo
  }
}

module.exports = AppstrapConfig