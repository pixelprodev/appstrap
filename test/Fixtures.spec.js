const supertest = require('supertest')
const strapDefault = require('./helpers/strapDefault')
const expect = require('expect')
const Fixture = require('../lib/Fixture')
describe('Fixtures', () => {
  it('Throws an error when the constructor fails to load the specified file at filePath', () => {
    expect(() => new Fixture('/path/not/found')).toThrow(/Cannot find module*/)
  })
  // todo dive deeper on validations
  it('Throws an error when validation fails for the loaded file', () => {
    expect(() => new Fixture('/test/fileVariations/fixtures/invalidFixture.js')).toThrow(/^Unable to validate file*/)
  })

  it('returns the fixture definition when validation succeeds for the loaded file', () => {
    const fixture = new Fixture('/test/fileVariations/fixtures/validFixture.js')
    expect(fixture.name).toBe('validFixture')
  })

  describe('Applied', () => {
    it('applies a fixture to a graphql operation')
    it('applies a fixture to a single route when path is /foo', async () => {
      const strap = strapDefault()
      strap.interactor.activateFixture('testOne')
      expect(strap.config.state.getState().fixtures.active.has('testOne'))
      const response = await supertest(strap).get('/foo')
      expect(response.body.bar).toBeDefined()
    })

    // planned future support
    it('applies a fixture to a route folder when path is /foo*')
    it('applies a fixture to all routes when path is *')

    it('applies a fixture to a parameterized route when path is /foo/:bar')
    it('applies multiple fixtures in activation order', async () => {
      const strap = strapDefault()
      strap.interactor.activateFixtures(['testOne', 'testThree'])
      const response = await supertest(strap).get('/foo')
      expect(response.body.bar).toBe('bingo')
      expect(response.body.zip).toBeDefined()
    })
  })
})
