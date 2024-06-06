const { INIT_STATE, INJECT_STATE } = require('../constants')

module.exports = function stateReducer (state = {}, action) {
  if (action.type === INIT_STATE) {
    return action.state
  }

  if (action.type === INJECT_STATE) {
    return { ...state, ...action.obj }
  }

  return state
}
