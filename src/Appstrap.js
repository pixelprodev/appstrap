import configLoader from './config/loader'
import AppServer from './AppServer'

class Appstrap {
  constructor ({configPath, port = 5000, config = configLoader.load(configPath)}) {
    AppServer.configure({port, isSPA: !!config.bundle})
  }

  get start () { return AppServer.start }
  get stop () { return AppServer.stop }
}

export default Appstrap
