const mergeDeep = require('lodash.merge')
const deepCopy = require('lodash.clonedeep')

class MemoryState {
  constructor ({ initialState = {} } = {}) {
    this.initialState = initialState
    this._state = deepCopy(initialState)
    this.reset = this.reset.bind(this)
  }

  get state () {
    return this._state
  }

  set state (data) {
    this._state = mergeDeep({}, this._state, data)
  }

  reset () {
    this._state = deepCopy(this.initialState)
  }
}

module.exports = MemoryState
