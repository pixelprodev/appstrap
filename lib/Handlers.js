const Handler = require('./Handler')
const { loadFile } = require('./_helpers')
const { match } = require('path-to-regexp')

class Handlers {
  constructor ({ config }) {
    this.config = config
    this.collection = this.load()
  }

  pick ({ path, method, operation }) {
    if (operation) {
      return this.collection.get(operation)
    }
    return Array.from(this.collection.values()).find((handler) => {
      const matcher = match(handler.path, { decode: decodeURIComponent })
      return matcher(path) !== false && handler.method.toUpperCase() === method.toUpperCase()
    })
  }

  load () {
    const handlers = new Map()
    const filePaths = this.config.files
      .filter(fileName => fileName.includes('routes'))
    filePaths.forEach(filePath => {
      const { operation, ...handlerMeta } = loadFile(filePath)
      for (const [method, handlerFn] of Object.entries(handlerMeta)) {
        const handler = new Handler({ operation, filePath, method: method.toUpperCase(), fn: handlerFn })
        handlers.set(handler.id, handler)
      }
    })
    return handlers
  }

  update () {
    const newCollection = this.load()
    const oldCollection = this.collection

    Array.from(newCollection.keys()).forEach(handlerId => {
      if (oldCollection.has(handlerId)) {
        const {
          error,
          errorCode,
          errorMessage,
          latency,
          latencyMS,
          disabled
        } = oldCollection.get(handlerId)
        const handler = newCollection.get(handlerId)
        handler.error = error
        handler.errorCode = errorCode
        handler.errorMessage = errorMessage
        handler.latency = latency
        handler.latencyMS = latencyMS
        handler.disabled = disabled
      }
    })
    this.collection = newCollection
  }
}

module.exports = Handlers
