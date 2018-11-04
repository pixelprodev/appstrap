const express = require('express')
const bodyParser = require('body-parser')
const vHost = require('vhost')
const path = require('path')

class ManagementVhost {
  constructor ({ config }) {
    this.configure({ config })
    this.middleware = vHost('appstrap.localhost', this._app)
  }

  configure ({ config }) {
    this._app = express()
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({ extended: true }))

    const assetPath = path.join(__dirname, 'management-interface', 'dist')
    this._app.use('/appstrap-assets', express.static(assetPath))

    this._app.get('/state', (req, res) => {
      res.json({
        presets: config.presets.state,
        endpoints: config.endpoints.collection
      })
    })
    this._app.put('/preset', (req, res) => {
      const { groupName } = req.body
      config.presets.activeGroups.has(groupName)
        ? config.presets.deactivatePreset(groupName)
        : config.presets.activatePreset(groupName)

      res.json(config.presets.state)
    })
    this._app.put('/endpoint', (req, res) => {
      const { key, ...data } = req.body
      config.endpoints.setModifier({ endpointKey: key, ...data })
      res.sendStatus(200)
    })
    this._app.all('*', (req, res) => res.send(this.generateSpaHarness()))
  }

  generateSpaHarness () {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">
          <title>Appstrap Management Interface</title>
      </head>
      <body>
        <div id="host"></div>
        <script src="/appstrap-assets/management-interface.js" type="text/javascript"></script>
      </body>
      </html>
    `
  }
}

module.exports = ManagementVhost
