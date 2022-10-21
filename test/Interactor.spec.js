const supertest = require('supertest')
const strapDefault = require('./helpers/strapDefault')

describe('Interactor', () => {
  beforeEach(() => {
    this.strap = strapDefault()
  })
  describe('activateFixture()', () => {
    it('Logs a warning when fixture to activate does not exist in list', async () => {
      this.strap.interactor.activateFixture('notFoundFixture')
      expect(this.strap.logger.warn.called).toBe(true)
      expect(this.strap.logger.warn.calledWith('Unable to activate fixture notFoundFixture - not found in collection')).toBe(true)
    })
    it('Activates a single fixture with state only')
    it('Activates a single fixture with state and routes')
    it('Activates a single fixture with single route only', async () => {
      this.strap.interactor.activateFixture('nested/testTwo')
      const response = await supertest(this.strap).get('/nested/twice/zip')
      expect(response.body.fixture).toBe('added')
      expect(this.strap.fixtures.active.has('nested/testTwo')).toBe(true)
    })
    it('Activates a single fixture with multiple routes')
  })
  describe('activateFixtures()', () => {
    it('activates a list of fixtures all at once', async () => {
      this.strap.interactor.activateFixtures(['nested/testTwo', 'testOne'])
      expect(this.strap.fixtures.active.size).toBe(2)
    })
  })
  describe('deactivateFixture()', () => {
    describe('direct api', () => {
      it('deactivates a single fixture at the front of the fixture queue', async () => {
        this.strap.interactor.activateFixture('nested/testTwo')
        expect(this.strap.fixtures.active.has('nested/testTwo')).toBe(true)

        this.strap.interactor.deactivateFixture('nested/testTwo')
        expect(this.strap.fixtures.active.has('nested/testTwo')).toBe(false)
      })
      it('deactivates a single fixture in the middle of the fixture queue')
      it('deactivates a single fixture at the end of the fixture queue')
    })
    describe('express api', () => {

    })
  })
})
