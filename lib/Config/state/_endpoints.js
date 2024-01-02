const { SET_MODIFIER, ENTITY_ADD, ENTITY_CHANGE, ENTITY_UNLINK } = require('../constants')
const Endpoint = require('../../Endpoint')

module.exports = function endpointsReducer (endpoints = [], action) {
  if (action.type === ENTITY_ADD && action.entity instanceof Endpoint) {
    return [...endpoints, action.entity]
  }

  if (action.type === ENTITY_CHANGE && action.entity instanceof Endpoint) {
    const matchingEndpointIndex = endpoints.findIndex(endpoint => endpoint.path === action.entity.path)
    const methods = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']
    methods.forEach(method => {
      if (endpoints[matchingEndpointIndex][method]) {
        const { handler, ...metadata } = endpoints[matchingEndpointIndex][method]
        Object.entries(metadata).forEach(([key, value]) => {
          action.entity[method][key] = value
        })
      }
    })
    endpoints[matchingEndpointIndex] = action.entity
    return [...endpoints]
  }

  if (action.type === ENTITY_UNLINK && action.filePath.includes('endpoints')) {
    const endpointRemovedPath = Endpoint.getPathFromFile(action.filePath)
    return endpoints.filter(e => e.path !== endpointRemovedPath)
  }

  if (action.type === SET_MODIFIER && typeof action.method !== 'undefined') {
    const { key, method, meta } = action
    const matchingEndpointIndex = endpoints.findIndex(endpoint => endpoint.path === key)
    if (matchingEndpointIndex > -1 && typeof endpoints[matchingEndpointIndex][method] !== 'undefined') {
      const updater = endpoints[matchingEndpointIndex]
      updater[method] = { ...updater[method], ...meta }
      endpoints[matchingEndpointIndex] = updater
    }
  }

  return endpoints
}
