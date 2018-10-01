const mergeDeep = require('lodash.merge')

class MemoryState {
  constructor ({ initialState = {} } = {}) {
    this._state = initialState
  }

  get state () {
    return this._state
  }

  set state (data) {
    this._state = mergeDeep({}, this._state, data)
  }
}

module.exports = MemoryState
