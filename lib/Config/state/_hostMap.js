const { INIT_HOSTMAP } = require('../constants')

module.exports = function hostMapReducer (state = {}, action) {
  if (action.type === INIT_HOSTMAP) {
    return action.hostMap
  }

  return state
}
