const express = require('express')
const bodyParser = require('body-parser')
const vHost = require('vhost')
const path = require('path')
const { locateProjectRoot } = require('../utilities')

class ManagementInterface {
  constructor ({ server, config, presets }) {
    this.server = server
    this.config = config
    this.presets = presets

    this._app = express()
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({extended: true}))

    const assetPath = config.fileData.name === '@pixelprodotco/appstrap'
      ? path.join(locateProjectRoot(), 'dist/')
      : path.normalize('node_modules/@pixelprodotco/appstrap/dist/')

    this._app.use('/appstrap-assets', express.static(assetPath))

    this._app.use(this.loadEndpoints())
    this.middleware = vHost('appstrap.localhost', this._app)
  }

  getSpaHarnessMarkup ({name, version} = this.config.fileData) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700" rel="stylesheet">
          <title>Appstrap Management Interface | ${name} - ${version}</title>
      </head>
      <body>
        <div id="host"></div>
        <script src="/appstrap-assets/management-interface.js" type="text/javascript"></script>
      </body>
      </html>
    `
  }

  loadEndpoints ({name, version} = this.config.fileData) {
    const Router = express.Router({})
    Router.get('/data/metadata', (req, res) => res.json({name, version}))
    Router.get('/data/endpoints', (req, res) => res.json(this.config.endpoints.fetch()))
    Router.get('/data/presets', (req, res) => res.json(this.presets.getStatus()))
    Router.put('/data/presets', (req, res) => {
      const action = req.body.active ? 'activatePresetGroup' : 'deactivatePresetGroup'
      this.presets[action]({name: req.body.name})
      // Returns new set of active presets whether added to / removed from
      res.json(this.presets.getStatus())
    })
    Router.put('/data/endpoint', (req, res) => {
      const {path, method, ...data} = req.body
      this.config.endpoints.setModifier({path, method, ...data})
      this.server.reloadEndpoints({config: this.config})
      res.json(this.config.endpoints.fetch({path, method}))
    })
    Router.all('*', (req, res) => res.send(this.getSpaHarnessMarkup()))
    return Router
  }
}

module.exports = ManagementInterface
