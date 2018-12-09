const Config = require('./Config')
const Server = require('./Server')
const chalk = require('chalk')
const opn = require('opn')
const fileWatcher = require('./fileWatcher')

class Appstrap {
  constructor ({
    cli = false,
    watch = false,
    useInterface = (cli || false),
    useDirectory
  } = {}) {
    this.cli = cli
    this.config = new Config({ useDirectory })
    this.server = new Server({ useInterface, config: this.config })
    if (watch) {
      fileWatcher.initialize({ config: this.config, server: this.server })
    }
    this.reset = this.reset.bind(this)
  }

  get address () {
    const { port } = this.server.httpServer.address()
    return `http://localhost:${port}`
  }

  get middleware () {
    return this.server._app
  }

  reset () {
    this.config.endpoints.reset()
    this.config.presets.reset()
    this.config.memoryState.reset()
  }

  // expose server methods
  async start () {
    try {
      const endpoint = await this.server.start()
      if (this.cli) {
        console.log(chalk`
          ===============================================================
            {yellow.bold Appstrap} loaded {green successfully}.
            A server has been started for you at the following address: 
            {blue http://${endpoint}}
    
            The management interface can be found at the following address:
            {blue http://appstrap.${endpoint}}
          ===============================================================
        `)
        opn(`http://${endpoint}`)
      }
      return endpoint
    } catch (e) {
      throw e
    }
  }
  stop () { return this.server.stop() }

  // expose preset methods
  get activatePreset () { return this.config.presets.activatePreset }
  get activatePresets () { return this.config.presets.activatePresets }
  get deactivatePreset () { return this.config.presets.deactivatePreset }
  get deactivatePresets () { return this.config.presets.deactivatePresets }

  // expose endpoint methods
  get setModifier () { return this.config.endpoints.setModifier }
}

module.exports = Appstrap
