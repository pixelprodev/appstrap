const { INIT_GQL } = require('../constants')

module.exports = function gqlReducer (state = { endpoint: null }, action) {
  if (action.type === INIT_GQL) {

  }

  return state
}
