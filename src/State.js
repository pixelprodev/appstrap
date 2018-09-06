const mergeDeep = require('lodash.merge')
const util = require('util')

class State {
  constructor ({initialState = {}} = {}) {
    this._state = initialState
  }

  getState () {
    return this._state
  }

  setState (data) {
    this._state = mergeDeep({}, this._state, data)
  }

  reset ({ initialState }) {
    console.log(`resetting state to ${util.inspect(initialState)}`)
    this._state = initialState
  }
}

module.exports = State
