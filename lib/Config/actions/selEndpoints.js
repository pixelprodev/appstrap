const { createSelector } = require('reselect')

const selEndpoints = createSelector(
  state => state.endpoints,
  state => state.gql,
  (endpoints, gql) => {
    const allEndpoints = [...endpoints]
    if (gql.endpoint) {
      allEndpoints.push(gql.endpoint)
    }
    return allEndpoints
  })

module.exports = exports = selEndpoints
