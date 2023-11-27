const Appstrap = require('../lib/Appstrap')
const expect = require('expect')
const selEndpoints = require('../lib/Config/actions/selEndpoints')
xdescribe('Request Forwarding', () => {
  it('flags all requests for forwarding when a wildcard is provided in the hostMap (*)', () => {
    const strap = new Appstrap({ repository: 'test/configs/withRequestForwardingAll' })
    const endpoints = selEndpoints(strap.config.state.getState())
    endpoints.forEach(endpoint => {
      ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'].forEach(method => {
        if (endpoint[method]) {
          expect(endpoint[method].requestForwardingDestination).toBe('http://localhost:4001')
        }
      })
    })
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
