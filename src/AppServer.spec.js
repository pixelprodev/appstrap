import { AppServer } from './AppServer'
import Endpoint from './endpoints/Endpoint'
import Request from 'supertest'
import { stub } from 'sinon'

describe('AppServer', () => {
  describe('constructor', () => {
    test('Generates a default express server with static response', async () => {
      const server = new AppServer()
      const resp1 = await Request(server._app).get('/foo')
      expect(resp1.text).toEqual('Welcome to appstrap!')
      const resp2 = await Request(server._app).get('/bar')
      expect(resp2.text).toEqual('Welcome to appstrap!')
      const resp3 = await Request(server._app).get('/some/nested/route')
      expect(resp3.text).toEqual('Welcome to appstrap!')

      const resp4 = await Request(server._app).post('/')
      expect(resp4.status).toEqual(404)
    })
  })

  describe('configure', () => {
    test('it sets server port', () => {
      const server = new AppServer()
      const func = stub(server, 'loadEndpoints').callsFake(() => {})
      server.configure({port: 5000, isSPA: true})
      expect(server.port).toEqual(5000)
      func.restore()
    })
    test('it indicates whether or not to serve the spa endpoint', () => {
      const server = new AppServer()
      const func = stub(server, 'loadEndpoints').callsFake(() => {})
      server.configure({port: 5000, isSPA: true})
      expect(server.isSPA).toEqual(true)
      server.configure({port: 5000, isSPA: false})
      expect(server.isSPA).toEqual(false)
      func.restore()
    })
    test('it attempts to load the endpoints', () => {
      const server = new AppServer()
      const func = stub(server, 'loadEndpoints').callsFake(() => {})
      server.configure()
      expect(func.called).toBe(true)
      func.restore()
    })
  })

  describe('loadEndpoints', function () {
    beforeEach(() => {
      this.server = new AppServer()
      this.mockConfigData = {
        name: 'test application',
        version: '1.0.0',
        bundle: { host: '#host', webPath: '/foo' }
      }
    })
    test('add default route to router when no endpoints specified', () => {
      const endpointCatchStub = stub(this.server, 'generateNoEndpointCatch')
      this.server.loadEndpoints()
      expect(endpointCatchStub.called).toBe(true)
      endpointCatchStub.restore()
    })
    test('does not add default route to router when isSPA and no endpoints specified', () => {
      const endpointCatchStub = stub(this.server, 'generateNoEndpointCatch')
      this.server.loadEndpoints({isSPA: true, configData: this.mockConfigData})
      expect(endpointCatchStub.called).toBe(false)
      endpointCatchStub.restore()
    })
    test('adds spa markup when single page app', async () => {
      const markupStub = stub(this.server, 'getSpaHarnessMarkup')
      this.server.loadEndpoints({isSPA: true})
      expect(markupStub.called).toBe(true)
      markupStub.restore()
    })
    test('adds asset routes when defined', () => {
      const assetStub = stub(this.server, 'generateAssetEndpoints')
      const assets = [{webPath: '/foo', directory: '/bar'}]
      this.server.loadEndpoints({configData: {...this.mockConfigData, assets}})
      expect(assetStub.called).toBe(true)
      assetStub.restore()
    })
    test('omits asset routes when undefined', () => {
      const assetStub = stub(this.server, 'generateAssetEndpoints')
      this.server.loadEndpoints({configData: this.mockConfigData})
      expect(assetStub.called).toBe(false)
      assetStub.restore()
    })
  })

  describe('getSpaHarnessMockup()', function () {
    beforeAll(() => {
      this.server = new AppServer()
      this.params = {name: 'test', version: '1.0.0', bundle: {host: '#test', webPath: '/foo/bar'}}
    })
    test('output title contains app name and version', () => {
      const markup = this.server.getSpaHarnessMarkup(this.params)
      expect(markup.includes(`Appstrap | ${this.params.name} - ${this.params.version}`)).toBe(true)
    })
    test('host div has id of X when host is #X', () => {
      const markup = this.server.getSpaHarnessMarkup(this.params)
      const host = this.params.bundle.host.replace('#', '')
      expect(markup.includes(`<div id="${host}"></div>`)).toBe(true)
    })
    test('host div has class of X when host is .X', () => {
      const params = Object.assign({}, this.params, {bundle: {host: '.test'}})
      const markup = this.server.getSpaHarnessMarkup(params)
      const host = params.bundle.host.replace('.', '')
      expect(markup.includes(`<div class="${host}"></div>`)).toBe(true)
    })
    test('script tag src equals the bundle webpath', () => {
      const markup = this.server.getSpaHarnessMarkup(this.params)
      expect(markup.includes(`<script src="${this.params.bundle.webPath}" `)).toBe(true)
    })
  })

  describe('getModifierMiddleware()', function () {
    beforeAll(() => {
      this.server = new AppServer()
    })
    test('returns 500 error when error is enabled', async () => {
      const errorStub = stub()
      const middleware = this.server.getModifierMiddleware({error: true})
      await middleware({}, {sendStatus: errorStub}, () => {})
      expect(errorStub.calledOnceWith(500)).toBe(true)
    })
    test('returns custom error code when provided', async () => {
      const errorStub = stub()
      const middleware = this.server.getModifierMiddleware({error: true, errorStatus: 400})
      await middleware({}, {sendStatus: errorStub}, () => {})
      expect(errorStub.calledOnceWith(500)).toBe(false)
      expect(errorStub.calledOnceWith(400)).toBe(true)
    })
    test('waits X ms when latency is enabled', async () => {
      const sleepStub = stub().usingPromise(Promise)
      const middleware = this.server.getModifierMiddleware({
        latency: true, latencyMS: 3000, delay: sleepStub
      })
      await middleware({}, {}, () => {})
      expect(sleepStub.calledOnceWith(3000)).toEqual(true)
    })
  })

  xdescribe('load / reloadEndpoints', function () {
    beforeEach(() => {
      this.server = new AppServer()
    })
    test('replaces the internal instance of express router', async () => {
      const initialResp = await Request(this.server._app).get('/')
      expect(initialResp.text).toEqual('Welcome to appstrap!')

      const endpoints = [new Endpoint({path: '/', method: 'get', handler: (req, res) => res.send('updated!')})]
      this.server.reloadEndpoints(endpoints)

      const updatedResp = await Request(this.server._app).get('/')
      expect(updatedResp.text).toEqual('updated!')
    })
  })
})
