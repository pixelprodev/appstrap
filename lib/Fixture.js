const mergeDeep = require('lodash.merge')

class Fixture {
  constructor ({ mode, data }) {
    this.mode = mode
    this.data = data
  }

  execute (resPayload) {
    switch (this.mode) {
      case 'replace':
        return this.data
      case 'deepMerge':
      case 'mergeDeep':
        return mergeDeep(resPayload, this.data)
      default: // merge
        return ({ ...resPayload, ...this.data })
    }
  }
}

module.exports = exports = Fixture
