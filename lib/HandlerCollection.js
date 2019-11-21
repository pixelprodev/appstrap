const Handler = require('./Handler')

class HandlerCollection {
  constructor ({ config }) {
    this.collection = new Map()
    this.mapCollection(config.fileData)
  }

  mapCollection ({ routes = [] }) {
    routes.forEach(({ path, ...handlers }) => {
      Object.keys(handlers).forEach(method => {
        const handler = new Handler({ path, method, fn: handlers[method] })
        this.collection.set(handler.key, handler)
      })
    })
  }
}

exports = module.exports = HandlerCollection
