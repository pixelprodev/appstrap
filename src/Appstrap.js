const configLoader = require('./configLoader')
const AppServer = require('./AppServer')
const getPort = require('get-port')

class Appstrap {
  constructor ({configFilePath, port = 5000, config = configLoader.load(configFilePath)}) {
    this.port = port
    this.config = config
    this.server = new AppServer()
    this.server.loadEndpoints(this.config.endpoints)
  }

  async start () {
    this.port = await getPort({port: this.port})
    await this.server.httpServer.listenAsync(this.port)
    console.log(`Now listening on port: ${this.port}`)
  }

  async stop () {
    await this.server.httpServer.closeAsync()
  }
}

module.exports = Appstrap
