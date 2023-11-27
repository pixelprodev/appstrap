const { CONFIG_LOAD, SET_ENDPOINT_ENABLED, SET_MODIFIER, CONFIG_RELOAD } = require('../constants')

const defaultModifiers = {
  error: false,
  errorCode: '',
  latency: false,
  latencyMS: '',
  enabled: true,
  requestForwardingEnabled: false,
  requestForwardingDestination: ''
}

module.exports = function gqlReducer (state = [], action) {
  if (action.type === CONFIG_LOAD) {
    return action.gqlOperations.map(({ operationName, handler }) => ({ ...defaultModifiers, operationName, handler }))
  }
  if (action.type === CONFIG_RELOAD) {
    const updater = [...state]
    action.gqlOperations.forEach(({ operationName, handler }) => {
      const matchingOpIndex = updater.findIndex(updaterOp => operationName === updaterOp.operationName)
      if (matchingOpIndex > -1) {
        updater.push({ ...defaultModifiers, operationName, handler })
      } else {
        updater[matchingOpIndex] = { ...updater[matchingOpIndex], handler }
      }
    })
    return updater
  }
  if (action.type === SET_ENDPOINT_ENABLED) {
    const { key, enabled } = action
    if (key.startsWith('/')) { return state }

    const updater = [...state]
    updater.forEach(operation => {
      if (operation.operationName === key) { operation.enabled = enabled }
    })
    return updater
  }

  if (action.type === SET_MODIFIER) {
    const { key, meta } = action
    if (key.startsWith('/')) { return state }

    const updater = [...state]
    updater.forEach((operation, indx) => {
      if (operation.operationName === key) {
        updater[indx] = { ...operation, ...meta }
      }
    })
    return updater
  }

  return state
}
