const configLoader = require('./configLoader')
const AppServer = require('./AppServer')
const getPort = require('get-port')

class Appstrap {
  constructor ({configPath, port = 5000, config = configLoader.load(configPath)}) {
    this.port = port
    this.config = config
    this.server = new AppServer()
    this.server.loadEndpoints(this.config.endpoints)
  }

  async start () {
    this.port = await getPort({port: this.port})
    await this.server.httpServer.listenAsync(this.port)
    console.log(`
    ===============================================================
      Appstrap loaded successfully.
      A server has been started for you at the following address: 
      http://localhost:${this.port}
    ===============================================================
    `)
  }

  async stop () {
    await this.server.httpServer.closeAsync()
  }
}

module.exports = Appstrap
