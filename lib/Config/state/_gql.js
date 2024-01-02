const { SET_GQL_ENDPOINT, ENTITY_ADD, SET_MODIFIER } = require('../constants')
const GqlOperation = require('../../GqlOperation')

module.exports = function gqlReducer (state = { endpoint: null, operations: [] }, action) {
  if (action.type === SET_GQL_ENDPOINT) {
    return { ...state, endpoint: action.endpoint }
  }

  if (action.type === ENTITY_ADD && action.entity instanceof GqlOperation) {
    return { ...state, operations: [...state.operations, action.entity] }
  }

  if (action.type === SET_MODIFIER && typeof action.method === 'undefined') {
    const { key, meta } = action

    const matchingOperationIndex = state.operations.findIndex(op => op.operationName === key)
    if (matchingOperationIndex > -1 && typeof state.operations[matchingOperationIndex] !== 'undefined') {
      const updater = state.operations
      updater[matchingOperationIndex] = { ...updater[matchingOperationIndex], ...meta }
      return { ...state, operations: updater }
    }
  }

  return state
}
