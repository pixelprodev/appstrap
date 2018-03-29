const Endpoint = require('../Endpoint')
const loadTestConfig = require('./_loadTestConfig')

describe('Endpoint', function () {
  this.config = loadTestConfig()
  test('constructor', () => {
    let { path, ...endpointSet } = this.config.endpoints[0]
    const endpoints = []
    Object.keys(endpointSet).forEach(endpoint => {
      endpoints.push(new Endpoint({
        path,
        method: endpoint,
        handler: endpointSet[endpoint]
      }))
    })
    const createdEndpoint = endpoints.shift()
    expect(createdEndpoint.path).toEqual(path)
    expect(createdEndpoint.method).toBeDefined()
    expect(createdEndpoint.handler).toBeDefined()
    expect(typeof createdEndpoint.handler).toEqual('function')
    expect(createdEndpoint.error).toEqual(false)
    expect(createdEndpoint.errorStatus).toEqual(500)
    expect(createdEndpoint.latency).toEqual(false)
    expect(createdEndpoint.latencyMS).toEqual(0)
  })
})
