const { normalizeRoutePathPrefix } = require('./_helpers')
const Handler = require('./Handler')

class HandlerCollection {
  constructor ({ config }) {
    this.collection = new Set()
    this.mapCollection(config.fileData)
  }

  mapCollection ({ routes = [] }) {
    routes.forEach(({ path, ...handlers }) => {
      Object.keys(handlers).forEach(method => {
        this.collection.add(new Handler({
          path: normalizeRoutePathPrefix(path),
          method,
          fn: handlers[method]
        }))
      })
    })
  }
}

exports = module.exports = HandlerCollection
