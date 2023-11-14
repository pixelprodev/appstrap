const mergeDeep = require('lodash.merge')

class Fixture {
  constructor ({ name, handlers }) {
    this.name = name
    this.handlers = handlers
  }

  execute (req, resPayload) {
    try {
      let fixture
      if (req.body && req.body.operationName) {
        fixture = this.handlers.find(handler => handler.operationName === req.body.operationName)
      } else {
        fixture = this.handlers.find(handler =>
          (handler.path === req.path) &&
          (handler.method.toUpperCase() === req.method.toUpperCase()))
      }
      if (!fixture) { return resPayload }
      const result = fixture.handler ? fixture.handler(req, resPayload) : fixture.payload
      switch (fixture.mode) {
        case 'replace':
          return result
        case 'mergeDeep':
          return mergeDeep(resPayload, result)
        default: // merge
          return Object.assign(resPayload, result)
      }
    } catch (e) {
      console.error(e)
      return resPayload
    }
  }
}

module.exports = exports = Fixture
