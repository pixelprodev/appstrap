import Server from './Server'
import Config from './config'
import Presets from './presets'
import path from 'path'

export class Appstrap {
  constructor ({
    configPath,
    config = new Config({ configPath: path.normalize(configPath) }),
    invokedFromCLI = false,
    port
  }) {
    this.config = config
    this.presets = new Presets({ configDir: this.config.configDir, invokedFromCLI })
    this.server = new Server({ config, invokedFromCLI, port, presets: this.presets })

    // Directly expose server express app for use in middleware situations.
    // Intentionally wrapped in function to propagate changes when configs are reloaded
    this.middleware = (req, res, next) => this.server._app(req, res, next)

    this.port = this.server.port
    this.start = this.server.start
    this.stop = this.server.stop
    this.setModifier = this.config.endpoints.setModifier
    this.clearModifier = this.config.endpoints.clearModifier
    this.loadPreset = this.presets.loadPreset
    this.loadPresets = this.presets.loadPresets
  }

  reset () {
    this.presets.clear()
    this.config.endpoints.clear()
  }
}

export default Appstrap
