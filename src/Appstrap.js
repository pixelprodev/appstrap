import Server from './Server'
import Config from './config'
import Presets from './presets'
import path from 'path'
import chokidar from 'chokidar'

export class Appstrap {
  constructor ({
    configPath = path.normalize('.appstrap/config.js'),
    config = new Config({ configPath }),
    invokedFromCLI = false,
    port
  } = {}) {
    this.invokedFromCLI = invokedFromCLI
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

    if (!__DEV__) { /* eslint-disable-line no-undef  */
      this.fileWatcher = chokidar.watch(configPath)
      const updateModules = this.updateModules.bind(this)
      setTimeout(() => { this.fileWatcher.on('all', updateModules) }, 3500)
    }
  }

  updateModules () {
    this.config.update()
    if (this.invokedFromCLI) {
      this.presets.update()
    }
    this.server.reloadEndpoints({ config: this.config })
  }

  reset () {
    this.presets.clear()
    this.config.endpoints.clear()
  }
}

export default Appstrap
module.exports = Appstrap
