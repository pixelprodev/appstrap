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
    this.fixtures = new Map()
    this.responseSequence = []
  }

  applyFixtures (data) {
    const fixtures = Array.from(this.fixtures.values())
    if (fixtures.length < 1) { return data }
    return fixtures.reduce((updatedData, fixture) => fixture.execute(updatedData), data)
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
