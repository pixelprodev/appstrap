const { normalizeRoutePathPrefix, sleep } = require('./_helpers')

class Handler {
  constructor ({ path, method, fn }) {
    const normalizedPath = normalizeRoutePathPrefix(path)
    this.key = `${normalizedPath}:::${method}`
    this.path = normalizedPath
    this.fn = fn
    this.method = method
    this.error = false
    this.errorCode = 500
    this.errorMessage = 'appstrap generated error'
    this.latency = false
    this.latencyMS = 0
    this.disabled = false
    this.intercepts = new Set()
  }

  applyIntercepts () {

  }

  async execute (req, res, next, state) {
    if (this.disabled) { return next() }
    if (this.latency) { await sleep(this.latencyMS) }
    if (this.error) { return res.status(this.errorCode).send(this.errorMessage) }
    this.fn(req, res, next, state)
  }
}

exports = module.exports = Handler
