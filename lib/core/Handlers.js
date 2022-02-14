class Handlers {
  constructor () {
    this.collection = new Map()
  }
}

class Handler {
  constructor ({ pathKey, method, fn }) {
    this.id = `${pathKey}.${method.toLowerCase()}`
    this.fn = fn
    this.method = method
    this.setDefaults()
  }

  setDefaults () {
    this.error = false
    this.errorCode = 500
    this.errorMessage = 'appstrap generated error'
    this.latency = false
    this.latencyMS = 0
    this.disabled = false
    this.fixtures = new Map()
  }
}
