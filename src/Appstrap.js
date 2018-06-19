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
    port,
    preserve = true
  } = {}) {
    this.invokedFromCLI = invokedFromCLI
    this.config = config
    this.presets = new Presets({ configDir: this.config.configDir, invokedFromCLI })
    this.server = new Server({ config, invokedFromCLI, port, presets: this.presets })

    // Directly expose server express app for use in middleware situations.
    // Intentionally wrapped in function to propagate changes when configs are reloaded
    this.middleware = (req, res, next) => this.server._app(req, res, next)

    this.start = this.server.start
    this.stop = this.server.stop
    this.setModifier = this.config.endpoints.setModifier
    this.clearModifier = this.config.endpoints.clearModifier
    this.loadPreset = this.presets.loadPreset
    this.loadPresets = this.presets.loadPresets

    if (!__TEST__) { /* eslint-disable-line no-undef  */
      this.fileWatcher = chokidar.watch(this.config.configDir)
      const updateModules = this.updateModules.bind(this, preserve)
      setTimeout(() => { this.fileWatcher.on('all', updateModules) }, 3500)
    }
  }

  get port () { return this.server.port }

  updateModules (preserve) {
    try {
      this.config.update()
      if (this.invokedFromCLI && this.config.fileData.initialState) {
        this.presets.update()
      }
      if (preserve !== true) {
        this.server.state.reset({ initialState: this.config.fileData.initialState })
      }
      this.server.reloadEndpoints({ config: this.config })
    } catch (e) {
      console.error('******************************************************************************')
      console.error('Attempt to reload configuration failed!')
      console.error(e.stack)
      console.error('******************************************************************************')
    }
  }

  reset () {
    this.presets.clear()
    this.config.endpoints.clear()
  }
}

export default Appstrap
module.exports = Appstrap
