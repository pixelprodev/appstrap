import mergeDeep from 'lodash.merge'

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
}

export default State
