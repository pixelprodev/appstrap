const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')

describe('loading static assets', () => {
  it('allows for the retrieval of static assets', async () => {
    const strap = strapDefault()
    const response = await request(strap).get('/images/appstrap-logo.png')
    expect(response.headers['content-type']).toEqual('image/png')
    expect(+response.headers['content-length']).toBeGreaterThan(500)
  })
})
