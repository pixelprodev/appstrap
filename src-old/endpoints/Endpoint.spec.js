const Endpoint = require('./Endpoint')
const { ErrEndpointInvalid } = require('../errors')
const Config = require('../config')
const path = require('path')

describe('Endpoint', () => {
  describe('constructor', () => {
    test('property contract', () => {
      const config = new Config({configPath: path.normalize('_test/_testConfig/config.js')})
      config.endpoints.fetch().forEach(endpoint => {
        expect(endpoint).toBeInstanceOf(Endpoint)
        expect(typeof endpoint.path).toBe('string')
        expect(endpoint.method).toBeDefined()
        expect(endpoint.handler).toBeDefined()
        expect(typeof endpoint.handler).toEqual('function')
        expect(endpoint.error).toEqual(false)
        expect(endpoint.errorStatus).toEqual(500)
        expect(endpoint.latency).toEqual(false)
        expect(endpoint.latencyMS).toEqual(0)
      })
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
