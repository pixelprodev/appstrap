const mergeDeep = require('lodash.merge')

class Fixture {
  constructor ({ name, handlers }) {
    this.name = name
    this.handlers = handlers
  }

  execute (req, resPayload, logger) {
    try {
      const fixture = req.isGraph
        ? this.handlers.find(handler => handler.operationName === resPayload.operationName)
        : this.handlers.find(handler =>
          (handler.path === req.path) &&
          (handler.method.toUpperCase() === req.method.toUpperCase())
        )
      if (!fixture) { return resPayload }
      if (fixture.handler) {
        return fixture.handler.call(req, resPayload)
      } else {
        switch (fixture.mode) {
          case 'replace':
            return fixture.payload
          case 'deepMerge':
          case 'mergeDeep':
            return mergeDeep(resPayload, fixture.payload)
          default: // merge
            return Object.assign(resPayload, fixture.payload)
        }
      }
    } catch (e) {
      console.error(e)
      return resPayload
    }
  }
}

module.exports = exports = Fixture
