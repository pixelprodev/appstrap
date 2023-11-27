const { SET_GQL_ENDPOINT, ENTITY_ADD } = require('../constants')
const GqlOperation = require('../../GqlOperation')

module.exports = function gqlReducer (state = { endpoint: null }, action) {
  if (action.type === SET_GQL_ENDPOINT) {
    return { ...state, endpoint: action.endpoint }
  }

  if (action.type === ENTITY_ADD && action.entity instanceof GqlOperation) {
    return { ...state, operations: [...state.operations, action.entity] }
  }

  return state
}
