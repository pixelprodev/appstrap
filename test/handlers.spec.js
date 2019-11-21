const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')

describe('Handlers', () => {
  it('Intercepts a route when defined in config endpoints property', async () => {
    const strap = strapDefault()
    const response = await request(strap).get('/foo')
    expect(response.text).toEqual('foo route intercepted')
  })
  it('Intercepts a route by specific method', async () => {
    const strap = strapDefault()
    let response = await request(strap).get('/bar')
    expect(response.status).toBe(404)
    response = await request(strap).post('/bar')
    expect(response.status).toBe(200)
    expect(response.text).toEqual('bar route intercepted')
  })
})
