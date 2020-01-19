const Handler = require('./Handler')
const { normalizeRoutePathPrefix } = require('./_helpers')

class HandlerManager {
  constructor ({ config }) {
    this.collection = new Map()
    this.mapCollection(config.fileData)
  }

  mapCollection ({ routes = [] }) {
    routes.forEach(({ path, ...handlers }) => {
      Object.keys(handlers).forEach(method => {
        const handler = new Handler({ path, method, fn: handlers[method] })
        this.collection.set(handler.id, handler)
      })
    })
  }

  pick (path, method) {
    const normalizedPath = normalizeRoutePathPrefix(path)
    return this.collection.get(`${normalizedPath}:::${method}`)
  }
}

exports = module.exports = HandlerManager
