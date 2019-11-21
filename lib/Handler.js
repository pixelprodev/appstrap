class Handler {
  constructor ({ path, method, fn }) {
    this.key = `${path}:::${method}`
    this.path = path
    this.fn = fn
    this.method = method
    this.error = false
    this.errorCode = 500
    this.latency = false
    this.latencyMS = 0
    this.intercepts = new Set()
  }

  applyIntercepts () {

  }

  addIntercept () {

  }

  removeIntercept () {

  }

  execute (req, res, next) {
    this.fn(req, res, next)
  }
}

exports = module.exports = Handler
