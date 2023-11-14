const { validateGqlOperation, validateEndpoint } = require('../validators')
const { loadFile } = require('../../_helpers')
const path = require('path')
const { GraphEndpoint, RestEndpoint } = require('./Endpoint')
const { WARN_NO_GQL_ENDPOINT } = require('../../_errors')

function getByKey (key, endpointMap) {
  if (key.startsWith('/')) {
    return ({ key, endpoint: endpointMap.get(key) })
  }
  for (const [url, endpoint] of endpointMap.entries()) {
    if (endpoint.endpointType === 'GQL') {
      if (endpoint.operations.has(key)) {
        return ({ key: url, endpoint: endpointMap.get(url) })
      }
    }
  }
  return {}
}

function initialize ({ files, gqlEndpoint, hostMap, events }) {
  const collection = new Map()

  // create graph endpoint
  if (gqlEndpoint) {
    const operations = new Map()
    const gqlOperationFilePaths = files.filter(pathname => pathname.includes('/gql/'))
    for (const gqlOperationFilePath of gqlOperationFilePaths) {
      const gqlOperation = loadFile(gqlOperationFilePath, validateGqlOperation, events)
      if (gqlOperation) {
        operations.set(path.basename(gqlOperationFilePath, '.js'), gqlOperation)
      }
    }
    collection.set(gqlEndpoint, new GraphEndpoint({ url: gqlEndpoint, operations }))
  }

  if (files.some(file => file.includes('/gql/')) && !gqlEndpoint) {
    events.emit('log', { level: 'warn', message: WARN_NO_GQL_ENDPOINT })
  }

  // create rest endpoint(s)
  const endpointFilePaths = files.filter(pathname => pathname.includes('/routes/'))
  for (const endpointFilePath of endpointFilePaths) {
    const endpointDefinition = loadFile(endpointFilePath, validateEndpoint, events)
    if (endpointDefinition) {
      const url = endpointFilePath.replace(/.*routes\//, '/').replace(/\[(.*?)\]/g, ':$1').replace('.js', '')
      const { ...methods } = endpointDefinition
      collection.set(url, new RestEndpoint({ url, methods }))
    }
  }

  // apply host map forwarding rules
  for (const [pattern, destination] of Object.entries(hostMap)) {
    for (const endpoint of collection.keys()) {
      const matcher = new RegExp(pattern.replace('*', '.*'))
      if (matcher.test(endpoint)) {
        const endpointInstance = collection.get(endpoint)
        endpointInstance.requestForwardingURL = destination
        collection.set(endpoint, endpointInstance)
      }
    }
  }

  return collection
}

module.exports = {
  initialize,
  getByKey
}
