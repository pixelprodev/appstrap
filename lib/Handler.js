const { normalizeRoutePathPrefix, sleep } = require('./_helpers')

class Handler {
  constructor ({ path, method, fn, logCycle }) {
    const normalizedPath = normalizeRoutePathPrefix(path)
    this.id = `${normalizedPath}:::${method}`
    this.path = normalizedPath
    this.fn = fn
    this.method = method
    this.logCycle = logCycle
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
    this.responseSequence = []
  }

  reset () {
    this.setDefaults()
  }

  applyFixtures (data) {
    return Array.from(this.fixtures.values()).reduce((updatedData, fixtureFn) => fixtureFn(updatedData), data)
  }

  addFixtureInterceptor (res) {
    const defaultResJSON = res.json
    const defaultResSendStatus = res.sendStatus
    res.json = (data) => {
      defaultResJSON.call(res, this.applyFixtures(data))
    }
    res.sendStatus = (status) => {
      const presetOverride = this.applyFixtures({})
      Object.keys(presetOverride).length > 0
        ? defaultResJSON.call(res, presetOverride)
        : defaultResSendStatus.call(res, status)
    }
    return res
  }

  addLogInterceptor (req, res) {
    const defaultSend = res.send
    res.send = (responsePayload) => {
      defaultSend.call(res, responsePayload)
      this.logCycle(req, res, responsePayload)
    }
    return res
  }

  async execute (req, res, next, state) {
    if (this.disabled) { return next() }
    if (this.latency) { await sleep(this.latencyMS) }
    if (this.error) { return res.status(this.errorCode).send(this.errorMessage) }
    res = this.addFixtureInterceptor(res)
    res = this.addLogInterceptor(req, res)
    if (this.responseSequence.length > 0) {
      const respond = this.responseSequence.shift()
      respond.call(res, req, res)
    } else { // use default function handler
      this.fn(req, res, next, state)
    }
  }
}

exports = module.exports = Handler
