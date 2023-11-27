const { CONFIG_LOAD } = require('../constants')
module.exports = function configReducer (state = {}, action) {
  if (action.type === CONFIG_LOAD) {
    return { ...state, hostMap: action.hostMap }
  }

  return state
}
