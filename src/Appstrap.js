const configLoader = require('./configLoader')
const AppServer = require('./AppServer')

class Appstrap {
  constructor ({configFilePath}) {
    this.config = configLoader.load(configFilePath)
    this.server = new AppServer()
    this.server.loadEndpoints(this.config.endpoints)
  }
}

module.exports = Appstrap
