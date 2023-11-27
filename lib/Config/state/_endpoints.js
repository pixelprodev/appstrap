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

module.exports = function endpointsReducer (state = [], action) {
  if (action.type === CONFIG_LOAD) {
    return action.endpoints.map(endpoint => ({ ...defaultModifiers, ...endpoint }))
  }
  if (action.type === CONFIG_RELOAD) {
    const updater = [...state]
    action.endpoints.forEach(endpoint => {
      const matchingOpIndex = updater.findIndex(updaterEndpoint => endpoint.path === updaterEndpoint.path && endpoint.method === updaterEndpoint.method)
      if (matchingOpIndex > -1) {
        updater.push({ ...defaultModifiers, ...endpoint })
      } else {
        updater[matchingOpIndex] = { ...updater[matchingOpIndex], ...endpoint }
      }
    })
    return updater
  }

  if (action.type === SET_ENDPOINT_ENABLED) {
    const { key, method, enabled } = action
    const updater = [...state]
    updater.forEach(endpoint => {
      const condition = method ? (endpoint.path === key && endpoint.method === method) : endpoint.path === key
      if (condition) { endpoint.enabled = enabled }
    })
    return updater
  }

  if (action.type === SET_MODIFIER) {
    const { key, method, meta } = action
    const updater = [...state]
    updater.forEach((endpoint, indx) => {
      const condition = method ? (endpoint.path === key && endpoint.method === method) : endpoint.path === key
      if (condition) {
        updater[indx] = ({ ...endpoint, ...meta })
      }
    })
    return updater
  }

  return state
}
