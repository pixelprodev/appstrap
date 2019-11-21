module.exports = {
  injectState: (state) => {
    state.injectedState = true
    return state
  }
}
