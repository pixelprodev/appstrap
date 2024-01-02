const { createSelector } = require('reselect')

const selEndpoints = createSelector(
  state => state.endpoints,
  state => state.gql,
  (endpoints, gql) => {
    const allEndpoints = [...endpoints]
    if (gql.endpoint) {
      const endpointObj = {
        path: gql.endpoint.path,
        matcher: gql.endpoint.matcher
      }
      gql.operations.map(operation => {
        const { operationName, ...definition } = operation
        endpointObj[operationName] = definition
      })
      allEndpoints.push(endpointObj)
    }
    return allEndpoints
  })

module.exports = exports = selEndpoints
