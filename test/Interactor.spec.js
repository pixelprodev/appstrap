const supertest = require('supertest')
const strapDefault = require('./helpers/strapDefault')
const expect = require('expect')
const joi = require('joi')
const Appstrap = require('../lib/Appstrap')

describe('Interactor', () => {
  beforeEach(() => {
    this.strap = strapDefault()
  })
  xdescribe('getStatus()', () => {
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
      it('disables only one method when one is specified by path', () => {
        this.strap.interactor.setEndpointEnabled({ key: '/foo', method: 'GET', enabled: false })
        const endpoints = this.strap.interactor.getStatus().endpoints
        const matchingEndpoints = endpoints.filter(endpoint => endpoint.path === '/foo')
        const getRoute = matchingEndpoints.find(e => e.method === 'GET')
        expect(getRoute.enabled).toBe(false)
        const postRoute = matchingEndpoints.find(e => e.method === 'POST')
        expect(postRoute.enabled).toBe(true)
      })
      it('disables all methods when no method is specified by path', () => {
        this.strap.interactor.setEndpointEnabled({ key: '/foo', enabled: false })
        const endpoints = this.strap.interactor.getStatus().endpoints
        const matchingEndpoints = endpoints.filter(endpoint => endpoint.path === '/foo')
        const getRoute = matchingEndpoints.find(e => e.method === 'GET')
        expect(getRoute.enabled).toBe(false)
        const postRoute = matchingEndpoints.find(e => e.method === 'POST')
        expect(postRoute.enabled).toBe(false)
      })
      it('disables the GQL operation when specified', () => {
        const gqlOperation = 'RunQueryOne'
        const strap = new Appstrap({ repository: 'test/configs/withGQL', gqlEndpoint: '/' })
        strap.interactor.setEndpointEnabled({ key: gqlOperation, enabled: false })
        const gqlOperations = strap.interactor.getStatus().gqlOperations
        const operation = gqlOperations.find(operation => operation.operationName === gqlOperation)
        expect(operation.enabled).toBe(false)
      })
    })
    describe('via rest', () => {
      it('disables only one method when one is specified by path', async () => {
        const response = await supertest(this.strap)
          .post('/__interactor/setEndpointEnabled')
          .send({ key: '/foo', method: 'GET', enabled: false })
        expect(response.status).toBe(200)
        const endpoints = this.strap.interactor.getStatus().endpoints
        const matchingEndpoints = endpoints.filter(endpoint => endpoint.path === '/foo')
        const getRoute = matchingEndpoints.find(e => e.method === 'GET')
        expect(getRoute.enabled).toBe(false)
        const postRoute = matchingEndpoints.find(e => e.method === 'POST')
        expect(postRoute.enabled).toBe(true)
      })
      it('disables all methods when no method is specified by path', async () => {
        const response = await supertest(this.strap)
          .post('/__interactor/setEndpointEnabled')
          .send({ key: '/foo', enabled: false })
        expect(response.status).toBe(200)
        const endpoints = this.strap.interactor.getStatus().endpoints
        const matchingEndpoints = endpoints.filter(endpoint => endpoint.path === '/foo')
        const getRoute = matchingEndpoints.find(e => e.method === 'GET')
        expect(getRoute.enabled).toBe(false)
        const postRoute = matchingEndpoints.find(e => e.method === 'POST')
        expect(postRoute.enabled).toBe(false)
      })
      it('disables the GQL operation when specified', async () => {
        const gqlOperation = 'RunQueryOne'
        const strap = new Appstrap({ repository: 'test/configs/withGQL', gqlEndpoint: '/' })
        const response = await supertest(strap)
          .post('/__interactor/setEndpointEnabled')
          .send({ key: gqlOperation, enabled: false })
        expect(response.status).toBe(200)
        strap.interactor.setEndpointEnabled({ key: gqlOperation, enabled: false })
        const gqlOperations = strap.interactor.getStatus().gqlOperations
        const operation = gqlOperations.find(operation => operation.operationName === gqlOperation)
        expect(operation.enabled).toBe(false)
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
      it('Activates a single fixture with single route only', async () => {
        this.strap.interactor.activateFixture('nested/testTwo')
        const response = await supertest(this.strap).get('/nested/twice/zip')
        expect(response.body.fixture).toBe('added')
        expect(this.strap.config.state.getState().fixtures.active.has('nested/testTwo')).toBe(true)
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
        expect(this.strap.config.state.getState().fixtures.active.size).toBe(2)
        Array.from(this.strap.config.state.getState().fixtures.active).forEach((fixtureName, index) => {
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
        expect(this.strap.config.state.getState().fixtures.active.has('nested/testTwo')).toBe(true)

        this.strap.interactor.deactivateFixture('nested/testTwo')
        expect(this.strap.config.state.getState().fixtures.active.has('nested/testTwo')).toBe(false)
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
