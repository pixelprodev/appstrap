const mergeDeep = require('lodash.merge')

class MemoryState {
  constructor ({ initialState = {} } = {}) {
    this.initialState = initialState
    this._state = initialState
    this.reset = this.reset.bind(this)
  }

  get state () {
    return this._state
  }

  set state (data) {
    this._state = mergeDeep({}, this._state, data)
  }

  reset () {
    this._state = this.initialState
  }
}

module.exports = MemoryState
