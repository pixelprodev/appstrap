const express = require('express')
const bodyParser = require('body-parser')
const ManagementVhost = require('./ManagementVhost')
const http = require('http')
const path = require('path')
const sleep = require('sleep-promise')
const MemoryState = require('./MemoryState')
const mergeDeep = require('lodash.merge')

class Server {
  constructor ({ enableManagementInterface, config }) {
    this.memoryState = new MemoryState({initialState: config.data.initialState})
    this.configure({ enableManagementInterface, config })
    this.httpServer = http.createServer(this._app)
    this.middleware = this.middleware.bind(this)
  }

  configure ({ enableManagementInterface, config }) {
    this._app = express()
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({ extended: true }))

    if (enableManagementInterface) {
      this._app.use(new ManagementVhost({ config }).middleware)
    }

    const router = this.configureRouter({ config })
    this._app.use((req, res, next) => router(req, res, next))
  }

  configureRouter ({ config }) {
    const Router = express.Router({})
    this.serveStaticAssets({ Router, config })
    config.endpoints.collection.forEach(endpoint => {
      const { method, path, key } = endpoint
      Router[method](path,
        ...this.middleware(key, config),
        (req, res, next) => {
          const endpoint = config.endpoints.collection.find(e => e.key === key)
          endpoint.handler.call(null, req, res, next)
        })
    })
    if (config.endpoints.enableClientSideRouting) {
      Router.use(config.endpoints.clientSideRoutingEndpoint)
    } else {
      if (config.endpoints.collection.length === 0) {
        Router.all('*', (req, res) => res.send('no endpoints defined'))
      }
    }
    return Router
  }

  serveStaticAssets ({ Router, config }) {
    if (config.data.assets && config.data.assets.length > 0) {
      config.data.assets.map(assetMapping => {
        Router.use(
          assetMapping.webPath,
          express.static(path.join(config.directory, assetMapping.directory))
        )
      })
    }
  }

  middleware (endpointKey, config) {
    const state = this.memoryState._state
    function endpointModifiers () {
      return async (req, res, next) => {
        const {
          error,
          errorStatus,
          latency,
          latencyMS
        } = config.endpoints.collection.find(e => e.key === endpointKey)
        if (latency) { await sleep(latencyMS) }
        return error ? res.sendStatus(errorStatus) : next()
      }
    }

    function memoryState () {
      return (req, res, next) => {
        req.state = res.state = state
        next()
      }
    }

    function presetInterceptor () {
      return (req, res, next) => {
        const defaultResJSON = res.json
        const presetMap = config.presets.activePresetMap
        const presetMapKey = endpointKey
        res.json = (data) => {
          if (presetMap.has(presetMapKey)) {
            let preset = presetMap.get(presetMapKey)
            data = preset.mode === 'replace'
              ? preset.data
              : preset.mode === 'mergeDeep'
                ? mergeDeep(data, preset.data)
                : { ...data, ...preset.data }
          }
          defaultResJSON.call(res, data)
        }
        next()
      }
    }

    return [
      endpointModifiers(),
      memoryState(),
      presetInterceptor()
    ]
  }

  start () {
    return new Promise((resolve, reject) => {
      this.httpServer.on('error', reject)

      this.httpServer.listen(() => {
        const { port } = this.httpServer.address()
        resolve(`localhost:${port}`)
      })
    })
  }

  stop () {
    return new Promise((resolve) => {
      this.httpServer.listening
        ? this.httpServer.close(() => resolve())
        : resolve()
    })
  }
}

module.exports = Server
