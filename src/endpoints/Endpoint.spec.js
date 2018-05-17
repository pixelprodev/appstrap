import Endpoint from './Endpoint'
import { ErrEndpointInvalid } from '../errors'
import { Loader } from '../config/loader'

describe('Endpoint', function () {
  this.Loader = new Loader()
  this.config = this.Loader.load('./_test/_testConfig/config.js')
  describe('constructor', () => {
    test('property contract', () => {
      this.config.endpoints.forEach(endpoint => {
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
