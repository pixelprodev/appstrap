const Endpoint = require('../lib/Endpoint')
const expect = require('expect')

describe('Endpoints', () => {
  it('Throws an error when the constructor fails to load the specified file at filePath', () => {
    expect(() => new Endpoint('/path/not/found')).toThrow(/Cannot find module*/)
  })
  it('Throws an error when validation fails for the loaded file', () => {
    expect(() => new Endpoint('/test/fileVariations/routes/invalidRoute.js')).toThrow(/^Unable to validate file*/)
  })
  // todo dive deeper on validations
  it('Returns the endpoint definition when validation succeeds for the loaded file', () => {
    expect(() => new Endpoint('/test/fileVariations/routes/validRoute.js')).not.toThrow()
    const endpoint = new Endpoint('/test/fileVariations/routes/validRoute.js')
    expect(endpoint).toBeDefined()
    expect(endpoint.GET).toBeDefined()
  })
  describe('Method definitions', () => {
    it('specifies a GET handler for a route definition that only exposes a GET property', () => {
      const endpoint = new Endpoint('/test/fileVariations/routes/routeWithGETOnly.js')
      expect(endpoint.GET).toBeDefined()
      expect(endpoint.PUT).not.toBeDefined()
      expect(endpoint.POST).not.toBeDefined()
      expect(endpoint.PATCH).not.toBeDefined()
      expect(endpoint.DELETE).not.toBeDefined()
    })
    it('specifies a multiple handlers for a route definition that exposes a GET and POST property', () => {
      const endpoint = new Endpoint('/test/fileVariations/routes/routeWithMultipleMethods.js')
      expect(endpoint.GET).toBeDefined()
      expect(endpoint.PUT).not.toBeDefined()
      expect(endpoint.POST).toBeDefined()
      expect(endpoint.PATCH).not.toBeDefined()
      expect(endpoint.DELETE).not.toBeDefined()
    })
    it('handles GET, PUT, POST, PATCH, and DELETE methods', () => {
      const endpoint = new Endpoint('/test/fileVariations/routes/routeWithAllMethods.js')
      expect(endpoint.GET).toBeDefined()
      expect(endpoint.PUT).toBeDefined()
      expect(endpoint.POST).toBeDefined()
      expect(endpoint.PATCH).toBeDefined()
      expect(endpoint.DELETE).toBeDefined()
    })
  })
  describe('Route forwarding', () => {
    it('maps a route forwarding rule when hostMap contains a matching pattern', () => {
      const endpoint = new Endpoint('/test/configs/default/routes/foo.js', { '/foo': '//some-endpoint' })
      expect(endpoint.GET.requestForwardingEnabled).toBe(true)
      expect(endpoint.GET.requestForwardingDestination).toEqual('//some-endpoint')
    })
    it('always maps a route forwarding rule when hostMap contains a wildcard pattern', () => {
      const endpoint = new Endpoint('/test/configs/default/routes/foo.js', { '*': '//some-endpoint' })
      expect(endpoint.GET.requestForwardingEnabled).toBe(true)
      expect(endpoint.GET.requestForwardingDestination).toEqual('//some-endpoint')
    })
    it('skips adding a forwarding rule when hostMap contains entries but no patterns match', () => {
      const endpoint = new Endpoint('/test/configs/default/routes/foo.js', { '/bar': '//some-endpoint' })
      expect(endpoint.GET.requestForwardingEnabled).toBe(false)
      expect(endpoint.GET.requestForwardingDestination).toEqual('')
    })
    it('skips adding a forwarding rule when hostMap has no entries', () => {
      const endpoint = new Endpoint('/test/configs/default/routes/foo.js', {})
      expect(endpoint.GET.requestForwardingEnabled).toBe(false)
      expect(endpoint.GET.requestForwardingDestination).toEqual('')
    })
    it('applies the FIRST route forwarding rule that matches a key in the host map', () => {
      const endpoint = new Endpoint('/test/configs/default/routes/bar.js',
        { '/bar': '//some-endpoint', '*': '//some-other-endpoint' }
      )
      expect(endpoint.GET.requestForwardingEnabled).toBe(true)
      expect(endpoint.GET.requestForwardingDestination).toEqual('//some-endpoint')
    })
  })
  describe('getPathFromFile', () => {
    it('Creates a relative path name based on the sub-path below /routes/x', () => {
      const fileName = Endpoint.getPathFromFile('/path/to/routes/sub/pathname.js')
      expect(fileName).toBe('/sub/pathname')
    })
    it('converts a bracketed pathname to colon parameters for path-to-regexp matching dynamic routes', () => {
      const fileName = Endpoint.getPathFromFile('/path/to/routes/sub/[dynamicRoute].js')
      expect(fileName).toBe('/sub/:dynamicRoute')
    })
    it('converts every sub path after "routes" into path depth', () => {
      const fileName = Endpoint.getPathFromFile('/path/to/routes/sub/child/lower/filename.js')
      expect(fileName).toBe('/sub/child/lower/filename')
    })
  })
})
