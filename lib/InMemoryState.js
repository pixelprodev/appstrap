class InMemoryState {
  constructor (initialState = {}) {
    this._state = initialState
  }

  get state () {
    return this._state
  }

  set state (data) {
    this._state = data
  }
}

exports = module.exports = InMemoryState
