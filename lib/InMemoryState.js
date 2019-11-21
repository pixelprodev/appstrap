const mergeDeep = require('lodash.merge')

class InMemoryState {
  constructor (initialState = {}) {
    this._state = initialState
  }

  get state () {
    return this._state
  }

  set state (data) {
    console.log(data)
    this._state = mergeDeep({}, this._state, data)
  }
}

exports = module.exports = InMemoryState
