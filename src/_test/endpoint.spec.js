const Endpoint = require('../Endpoint')
const { ErrEndpointInvalid } = require('../errors')
const loadTestConfig = require('./_loadTestConfig')

describe('Endpoint', function () {
  this.config = loadTestConfig()
  describe('constructor', () => {
    test('property contract', () => {
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
    test('throws error when attempting to create a new endpoint without path', () => {
      expect(() => new Endpoint({method: 'get', handler: () => {}})).toThrow(ErrEndpointInvalid)
    })
    test('throws error when attempting to create a new endpoint without method', () => {
      expect(() => new Endpoint({path: '/', handler: () => {}})).toThrow(ErrEndpointInvalid)
    })
    test('throws error when attempting to create a new endpoint without handler', () => {
      expect(() => new Endpoint({path: '/', method: 'get'})).toThrow(ErrEndpointInvalid)
    })
  })
})
