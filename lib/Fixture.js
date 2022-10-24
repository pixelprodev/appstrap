const mergeDeep = require('lodash.merge')

class Fixture {
  constructor ({ mode, data }) {
    this.mode = mode
    this.data = data
  }

  execute (resPayload) {
    const payload = JSON.parse(JSON.stringify(resPayload))
    switch (this.mode) {
      case 'replace':
        return this.data
      case 'deepMerge':
      case 'mergeDeep':
        return mergeDeep(payload, this.data)
      default: // merge
        return ({ ...payload, ...this.data })
    }
  }
}

module.exports = exports = Fixture
