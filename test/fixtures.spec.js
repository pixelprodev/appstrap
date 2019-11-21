const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')

describe('fixtures', () => {
  it('intercepts a route when fixtures are applied', async () => {
    const strap = strapDefault()
    strap.interactor.activateFixture('test-fixture-one')
    const response = await request(strap).get('/fixture-intercept')
    console.log(response.body)
  })
})
