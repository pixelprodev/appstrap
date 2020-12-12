const Handler = require('./Handler')
const { normalizeWebRoutePathPrefix } = require('./_helpers')

class HandlerManager {
  constructor ({ config, logCycle }) {
    this.collection = new Map()
    this.mapCollection(config.fileData, logCycle)
  }

  mapCollection ({ routes = [] }, logCycle) {
    routes.forEach(({ path, ...handlers }) => {
      Object.keys(handlers).forEach(method => {
        const handler = new Handler({ path, method, fn: handlers[method], logCycle })
        this.collection.set(handler.id, handler)
      })
    })
  }

  pick (path, method) {
    const normalizedPath = normalizeWebRoutePathPrefix(path)
    return this.collection.get(`${normalizedPath}:::${method}`)
  }
}

exports = module.exports = HandlerManager
