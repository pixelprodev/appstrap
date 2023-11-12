const supertest = require('supertest')
const strapDefault = require('./helpers/strapDefault')
const expect = require('expect')
const joi = require('joi')
const Appstrap = require('../lib/Appstrap')
const { ERR_NO_MATCHING_METHOD_UPDATE, ERR_NO_MATCHING_ENDPOINT_UPDATE } = require('../lib/_errors')

describe('Interactor', () => {
  beforeEach(() => {
    this.strap = strapDefault()
  })
  describe('getStatus()', () => {
    before(() => {
      this.validator = joi.object({
        fixtures: joi.array().items(joi.object({
          name: joi.string(),
          active: joi.bool(),
          order: joi.number(),
          handlers: joi.array().items(joi.object({
            path: joi.string(),
            mode: joi.string(),
            payload: joi.object(),
            handler: joi.string(),
            method: joi.string(),
            operationName: joi.string()
          }))
        })),
        endpoints: joi.array(),
        state: joi.object()
      })
    })
    describe('direct', () => {
      it('gets an object representing the configuration status', () => {
        this.strap.interactor.activateFixture('testOne')
        const status = this.strap.interactor.getStatus()
        const shapeValidationResult = this.validator.validate(status)
        expect(shapeValidationResult.value).not.toEqual({})
        expect(shapeValidationResult.error).not.toBeDefined()
      })
    })
    describe('via rest', () => {
      it('gets an object representing the configuration status', async () => {
        const response = await supertest(this.strap).get('/__interactor/getStatus')
        const shapeValidationResult = this.validator.validate(response.body)
        expect(shapeValidationResult.value).not.toEqual({})
        expect(shapeValidationResult.error).not.toBeDefined()
      })
    })
  })
  describe('setEndpointEnabled()', () => {
    describe('direct', () => {
      it('throws an error when a specified path does not exist', () => {
        const enableMissingPath = () => this.strap.interactor.setEndpointEnabled({ key: '/missing' })
        expect(enableMissingPath).toThrow(ERR_NO_MATCHING_ENDPOINT_UPDATE)
      })
      it('throws an error when attempting to update a method not supported in route', () => {
        const enableMissingMethod = () => this.strap.interactor.setEndpointEnabled({ key: '/foo', method: 'DELETE' })
        expect(enableMissingMethod).toThrow(ERR_NO_MATCHING_METHOD_UPDATE)
      })
      it('disables only one method when one is specified by path', () => {
        this.strap.interactor.setEndpointEnabled({ key: '/foo', method: 'GET', enabled: false })
        const { endpoint } = this.strap.config.endpoints.getByKey('/foo')
        expect(endpoint.enabled).toBe(true)
        expect(endpoint.modifiers.get('GET').enabled).toBe(false)
        expect(endpoint.modifiers.get('POST').enabled).toBe(true)
      })
      it('disables the entire route when no method is specified by path', () => {
        this.strap.interactor.setEndpointEnabled({ key: '/foo', enabled: false })
        const { endpoint } = this.strap.config.endpoints.getByKey('/foo')
        expect(endpoint.enabled).toBe(false)
      })
      it('throws an error when a specified GQL operation does not exist', () => {
        const strap = new Appstrap({ repository: 'test/configs/withGQL' })
        const enableMissingOperation = () => strap.interactor.setEndpointEnabled({ key: 'missing' })
        expect(enableMissingOperation).toThrow(ERR_NO_MATCHING_ENDPOINT_UPDATE)
      })
      it('disables the GQL operation when specified', () => {
        const gqlOperation = 'RunQueryOne'
        const strap = new Appstrap({ repository: 'test/configs/withGQL', gqlEndpoint: '/' })
        strap.interactor.setEndpointEnabled({ key: gqlOperation, enabled: false })
        const { endpoint } = strap.config.endpoints.getByKey(gqlOperation)
        expect(endpoint.modifiers.get(gqlOperation).enabled).toBe(false)
      })
    })
    describe('via rest', () => {
      it('throws an error when a specified path does not exist', async () => {
        const response = await supertest(this.strap)
          .post('/__interactor/setEndpointEnabled')
          .send({ key: '/missing', enabled: false })
        expect(response.status).toBe(404)
        expect(response.body.message).toBe(ERR_NO_MATCHING_ENDPOINT_UPDATE)
      })
      it('disables only one method when one is specified by path', async () => {
        const response = await supertest(this.strap)
          .post('/__interactor/setEndpointEnabled')
          .send({ key: '/foo', method: 'GET', enabled: false })
        expect(response.status).toBe(200)
        const { endpoint } = this.strap.config.endpoints.getByKey('/foo')
        expect(endpoint.enabled).toBe(true)
        expect(endpoint.modifiers.get('GET').enabled).toBe(false)
        expect(endpoint.modifiers.get('POST').enabled).toBe(true)
      })
      it('disables the entire route when no method is specified by path', async () => {
        const response = await supertest(this.strap)
          .post('/__interactor/setEndpointEnabled')
          .send({ key: '/foo', enabled: false })
        expect(response.status).toBe(200)
        const { endpoint } = this.strap.config.endpoints.getByKey('/foo')
        expect(endpoint.enabled).toBe(false)
      })
      it('throws an error when a specified GQL operation does not exist', async () => {
        const strap = new Appstrap({ repository: 'test/configs/withGQL' })
        const response = await supertest(strap)
          .post('/__interactor/setEndpointEnabled')
          .send({ key: 'missing', enabled: false })
        expect(response.status).toBe(404)
        expect(response.body.message).toBe(ERR_NO_MATCHING_ENDPOINT_UPDATE)
      })
      it('disables the GQL operation when specified', async () => {
        const gqlOperation = 'RunQueryOne'
        const strap = new Appstrap({ repository: 'test/configs/withGQL', gqlEndpoint: '/' })
        const response = await supertest(strap)
          .post('/__interactor/setEndpointEnabled')
          .send({ key: gqlOperation, enabled: false })
        expect(response.status).toBe(200)
        const { endpoint } = strap.config.endpoints.getByKey(gqlOperation)
        expect(endpoint.modifiers.get(gqlOperation).enabled).toBe(false)
      })
    })
  })
  describe('setModifier()', () => {
    describe('direct', () => {
      it('disables an endpoint', () => {
        const strap = new Appstrap({ repository: 'test/configs/withGQL', gqlEndpoint: '/' })
        strap.interactor.setModifier({ key: 'RunQueryOne', enabled: false })
      })
    })
    describe('via rest', () => {})
  })

  describe('activateFixture()', () => {
    describe('direct', () => {
      it('Logs a warning when fixture to activate does not exist in list', async () => {
        this.strap.interactor.activateFixture('notFoundFixture')
        expect(this.strap.logger.warn.called).toBe(true)
        expect(this.strap.logger.warn.calledWith('Unable to activate fixture notFoundFixture - not found in collection')).toBe(true)
      })
      it('Activates a single fixture with single route only', async () => {
        this.strap.interactor.activateFixture('nested/testTwo')
        const response = await supertest(this.strap).get('/nested/twice/zip')
        expect(response.body.fixture).toBe('added')
        expect(this.strap.config.fixtures.active.has('nested/testTwo')).toBe(true)
      })
      it('Activates a single fixture with multiple routes')
    })
    describe('via rest', () => {

    })
  })
  describe('activateFixtures()', () => {
    describe('direct', () => {
      it('activates a list of fixtures all at once in preserved order', async () => {
        const fixtureList = ['nested/testTwo', 'testOne']
        this.strap.interactor.activateFixtures(fixtureList)
        expect(this.strap.config.fixtures.active.size).toBe(2)
        Array.from(this.strap.config.fixtures.active).forEach((fixtureName, index) => {
          expect(fixtureName).toEqual(fixtureList[index])
        })
      })
    })
    describe('via rest', () => {

    })
  })
  describe('deactivateFixture()', () => {
    describe('direct', () => {
      it('deactivates a single fixture at the front of the fixture queue', async () => {
        this.strap.interactor.activateFixture('nested/testTwo')
        expect(this.strap.config.fixtures.active.has('nested/testTwo')).toBe(true)

        this.strap.interactor.deactivateFixture('nested/testTwo')
        expect(this.strap.config.fixtures.active.has('nested/testTwo')).toBe(false)
      })
      it('deactivates a single fixture in the middle of the fixture queue')
      it('deactivates a single fixture at the end of the fixture queue')
    })
    describe('via rest', () => {

    })
  })
  describe('injectState()', () => {
    describe('direct', () => {})
    describe('via rest', () => {})
  })
  describe('addResponseSequence()', () => {
    describe('direct', () => {})
    describe('via rest', () => {})
  })
})
