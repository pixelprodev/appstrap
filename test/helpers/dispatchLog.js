class DispatchLog {
  constructor () {
    this.history = []
  }

  captureHistory () {
    return (next) => (action) => {
      this.history.push(action)
      return next(action)
    }
  }

  resetHistory () {
    this.history = []
  }

  find (searchFn) {
    return this.history.find(searchFn)
  }
}

module.exports = DispatchLog
