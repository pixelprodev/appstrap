const Appstrap = require('../')
const request = require('supertest')

describe('Handlers', () => {
  it('Intercepts a route when defined in config endpoints property', async () => {
    const strap = new Appstrap({ config: './test/_configs/defaultConfig.js' })
    const response = await request(strap).get('/foo')
    expect(response.text).toEqual('foo route intercepted')
  })
})
