const strapDefault = require('./helpers/strapDefault')
const supertest = require('supertest')
const expect = require('expect')

describe('Responses', () => {
  describe('No route match', () => {
    it('returns a 404 not found', async () => {
      const strap = strapDefault()
      const response = await supertest(strap).get('/unknownRoute')
      expect(response.status).toEqual(404)
    })
  })
  describe('Proxied Request', () => {
    it('returns a 404 response when proxy is disabled and no local handler present')
    it('proxies a single route to another server when specified /foo')
    it('proxies a route folder to another server when specified /foo*')
    it('proxies all routes to another server when specified *')
    it('proxies a sub route to another server when specified /foo/bar')
    it('proxies a sub folder to another server when specified /foo/bar*')
    it('proxies a parameterized route to another server when specified /foo/:param')
  })
  describe('Locally Handled Request', () => {
    it('returns a 404 response when matched route is disabled')
    it('returns a response when matched route has defined proxy route but proxy is disabled')
    it('returns a response from a locally defined GQL handler')
    it('returns a response from a handler defined when path is /foo', async () => {
      const strap = strapDefault()
      const response = await supertest(strap).get('/foo')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ hello: 'world', foo: 'bar' })
    })
    it('returns a response from a handler defined when path is /foo/[bar] (parameterized)', async () => {
      const strap = strapDefault()
      const response = await supertest(strap).get('/foo/test123')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ parameter: 'test123' })
    })
  })
})
