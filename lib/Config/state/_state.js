const { INIT_STATE } = require('../constants')

module.exports = function stateReducer (state = {}, action) {
  if (action.type === INIT_STATE) {
    return action.state
  }

  return state
}
