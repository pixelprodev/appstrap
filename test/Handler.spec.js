const supertest = require('supertest')
const strapDefault = require('./helpers/strapDefault')
const expect = require('expect')
describe('Handlers', () => {
  it('receives a response from a defined handler', async () => {
    const strap = strapDefault()
    const response = await supertest(strap).get('/foo')
    expect(response.body).toBeDefined()
  })
  it('receives the defined route parameter successfully', async () => {
    const strap = strapDefault()
    const response = await supertest(strap).get('/nested/someRouteParam')
    expect(response.text).toEqual('someRouteParam')
  })
})
