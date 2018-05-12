import AppServer from './AppServer'
import Endpoints from './endpoints'
import Config from './config/loader'
import Presets from './presets'

export class Appstrap {
  constructor ({configPath, port = 5000, invokedFromCLI = false, endpoints, config = Config.load(configPath)}) {
    AppServer.configure({
      port,
      invokedFromCLI,
      configData: config,
      endpoints,
      isSPA: (config.bundle && Object.keys(config.bundle).length > 0)
    })
    if (invokedFromCLI) {
      Presets.preloadPresets()
    }
  }
  get port () { return AppServer.port }
  get start () { return AppServer.start }
  get stop () { return AppServer.stop }
  get reset () { return Config.reload }
  get setModifier () { return Endpoints.setModifier }
  get clearModifier () { return Endpoints.clearModifier }
  get loadPreset () { return Presets.loadPreset }
  get loadPresets () { return Presets.loadPresets }
}

export default Appstrap
