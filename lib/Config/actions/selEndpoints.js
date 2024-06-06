const { createSelector } = require('reselect')

function pushParametersToEnd (a, b) {
  if (!a.path.includes(':') && b.path.includes(':')) {
    return -1
  } else if (a.path.includes(':') && !b.path.includes(':')) {
    return 1
  } else {
    return 0
  }
}

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
      gql.operations.forEach(operation => {
        const { operationName, ...definition } = operation
        endpointObj[operationName] = definition
      })
      allEndpoints.push(endpointObj)
    }
    return allEndpoints.sort(pushParametersToEnd)
  })

module.exports = exports = selEndpoints
