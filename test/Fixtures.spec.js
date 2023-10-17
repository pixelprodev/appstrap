const supertest = require('supertest')
const strapDefault = require('./helpers/strapDefault')
const expect = require('expect')
describe('Fixtures', () => {
  it('applies a single activated fixture', async () => {
    const strap = strapDefault()
    strap.interactor.activateFixture('testOne')
    const response = await supertest(strap).get('/foo')
    expect(response.body.bar).toBeDefined()
  })
  it('applies multiple activated fixtures in order', async () => {
    const strap = strapDefault()
    strap.interactor.activateFixtures(['testOne', 'testThree'])
    const response = await supertest(strap).get('/foo')
    expect(response.body.bar).toBe('bingo')
    expect(response.body.zip).toBeDefined()
  })
})
