const { sleep } = require('./_helpers')

class Handler {
  constructor ({ operation, filePath, method, fn }) {
    this.path = filePath
      .replace(/.*routes\//, '/')
      .replace(/\[(.*?)\]/g, ':$1')
      .replace('.js', '')
    this.id = operation || `${this.path}:::${method.toUpperCase()}`
    this.fn = fn
    this.method = method.toLowerCase()
    this.setDefaults()
  }

  setDefaults () {
    this.error = false
    this.errorCode = 500
    this.errorMessage = 'appstrap generated error'
    this.latency = false
    this.latencyMS = 0
    this.disabled = false
    this.responseSequence = []
  }

  async execute (req, res, next, state) {
    if (this.disabled) { return next() }
    if (this.latency) { await sleep(this.latencyMS) }
    if (this.error) { return res.status(this.errorCode).send(this.errorMessage) }
    if (this.responseSequence.length > 0) {
      const respond = this.responseSequence.shift()
      respond.call(res, req, res)
    } else { // use default function handler
      this.fn(req, res, next, state)
    }
  }
}

exports = module.exports = Handler
