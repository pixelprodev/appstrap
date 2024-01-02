const { SET_GQL_ENDPOINT } = require('../constants')
const { match } = require('path-to-regexp')
const { select, put } = require('redux-saga/effects')
const resolveGqlHandler = require('./resolveGqlHandler')

function * initGql ({ gqlEndpoint }) {
  const hostMap = yield select(state => state.hostMap)
  const gqlOperations = yield select(state => state.gql.operations)
  const requestForwardingPath = Object.keys(hostMap).find(pathKey => {
    if (pathKey === '*') { return true }
    const matcher = new RegExp(pathKey)
    return matcher.test(gqlEndpoint)
  })
  yield put({
    type: SET_GQL_ENDPOINT,
    endpoint: {
      path: gqlEndpoint,
      matcher: match(gqlEndpoint, { decode: decodeURIComponent }),
      POST: {
        enabled: true,
        handler: (context) => resolveGqlHandler(context, gqlOperations),
        requestForwardingEnabled: !!requestForwardingPath,
        requestForwardingDestination: hostMap[requestForwardingPath] || ''
      }
    }
  })
}

module.exports = exports = initGql
