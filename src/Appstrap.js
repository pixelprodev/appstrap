import AppServer from './AppServer'
import Endpoints from './endpoints'
import Config from './config/loader'

class Appstrap {
  constructor ({configPath, port = 5000, config = Config.load(configPath)}) {
    AppServer.configure({port, isSPA: !!config.bundle})
  }

  get start () { return AppServer.start }
  get stop () { return AppServer.stop }
  get reset () { return Config.reload({reloadFromFS: false}) }
  get setModifier () { return Endpoints.setModifier }
  get clearModifier () { return Endpoints.clearModifier }
}

export default Appstrap
