const express = require('express')
const vhost = require('vhost')

class AppstrapServer {
  constructor (config) {
    this.app = express()
    this.port = config.port
    this.loadConfigUI()
  }

  loadConfigUI () {
    const configUI = express()
    configUI.get('*', (req, res) => res.send('this is the config ui'))
    this.app.use(vhost('appstrap.localhost', configUI))
  }

  loadRoutes () {

  }

  start () {
    const { app, port } = this
    app.listen(port, console.log(`Server is now live on port ${port}`))
  }
}

module.exports = AppstrapServer