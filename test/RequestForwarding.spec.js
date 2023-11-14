const Appstrap = require('../lib/Appstrap')
const expect = require('expect')
describe('Request Forwarding', () => {
  it('flags all requests for forwarding when a wildcard is provided in the hostMap (*)', () => {
    const strap = new Appstrap({ repository: 'test/configs/withRequestForwardingAll' })
    const endpoints = Array.from(strap.config.endpoints.values())
    expect(endpoints.every(endpoint => endpoint.requestForwardingURL === 'http://localhost:4001')).toBe(true)
  })
  it('flags endpoints under a sub-route for forwarding when a wildcard is provided under that route in the hostMap (/nested*)', () => {
    const strap = new Appstrap({ repository: 'test/configs/withRequestForwarding' })
    const endpoints = Array.from(strap.config.endpoints.entries())
    endpoints.forEach(([endpoint, definition]) => {
      endpoint.startsWith('/nested')
        ? expect(definition.requestForwardingURL).toEqual('http://localhost:4001')
        : expect(definition.requestForwardingURL).not.toEqual('http://localhost:4001')
    })
  })
  it('flags a single route for forwarding when specified exact match in hostMap (/foo)', () => {
    const strap = new Appstrap({ repository: 'test/configs/withRequestForwarding' })
    const endpoints = Array.from(strap.config.endpoints.entries())
    endpoints.forEach(([endpoint, definition]) => {
      endpoint === '/foo'
        ? expect(definition.requestForwardingURL).toEqual('http://localhost:4000')
        : expect(definition.requestForwardingURL).not.toEqual('http://localhost:4000')
    })
  })
})
