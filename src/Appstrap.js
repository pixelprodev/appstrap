import AppServer from './AppServer'
import Endpoints from './endpoints'
import Config from './config/loader'

class Appstrap {
  constructor ({configPath, port = 5000, invokedFromCLI = false, config = Config.load(configPath)}) {
    AppServer.configure({port, invokedFromCLI, isSPA: (config.bundle && Object.keys(config.bundle).length > 0)})
  }
  get port () { return AppServer.port }
  get start () { return AppServer.start }
  get stop () { return AppServer.stop }
  get reset () { return Config.reload({reloadFromFS: false}) }
  get setModifier () { return Endpoints.setModifier }
  get clearModifier () { return Endpoints.clearModifier }
}

export default Appstrap
