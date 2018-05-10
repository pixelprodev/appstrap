import fetch from 'isomorphic-fetch'
import { AppServer } from './AppServer'
import express from 'express'
import { stub } from 'sinon'
import Endpoint from './endpoints/Endpoint'
import { locateProjectRoot } from './utilities'

describe('AppServer', () => {
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
        bundle: {host: '#host', webPath: '/foo'}
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

  describe('modifierMiddleware()', function () {
    beforeAll(() => {
      this.server = new AppServer()
    })
    test('returns 500 error when error is enabled', async () => {
      const errorStub = stub()
      const middleware = this.server.modifierMiddleware({error: true})
      await middleware({}, {sendStatus: errorStub}, () => {})
      expect(errorStub.calledOnceWith(500)).toBe(true)
    })
    test('returns custom error code when provided', async () => {
      const errorStub = stub()
      const middleware = this.server.modifierMiddleware({error: true, errorStatus: 400})
      await middleware({}, {sendStatus: errorStub}, () => {})
      expect(errorStub.calledOnceWith(500)).toBe(false)
      expect(errorStub.calledOnceWith(400)).toBe(true)
    })
    test('waits X ms when latency is enabled', async () => {
      const sleepStub = stub().usingPromise(Promise)
      const middleware = this.server.modifierMiddleware({
        latency: true, latencyMS: 3000, delay: sleepStub
      })
      await middleware({}, {}, () => {})
      expect(sleepStub.calledOnceWith(3000)).toEqual(true)
    })
  })

  describe('preHandlerMiddleware()', () => {
    test('overrides res.json with middleware to account for presets')
  })

  describe('interceptJsonResponse()', function () {
    beforeEach(() => {
      this.AppServer = new AppServer()
      this.fakeRouter = { res: {json: stub()} }
    })
    test('returns the same data if no preset found', () => {
      const func = this.AppServer.interceptJsonResponse({res: this.fakeRouter.res, preset: -1})
      const data = {foo: 'bar', baz: 'zip', zing: 'woo'}
      func(data)
      expect(this.fakeRouter.res.json.lastCall.args[0]).toEqual(data)
    })
    test('merges preset data in with existing data if mode = merge', () => {
      const preset = {mode: 'merge', data: { baz: 'pow' }}
      const func = this.AppServer.interceptJsonResponse({res: this.fakeRouter.res, preset})
      const data = {foo: 'bar', baz: 'zip', zing: 'woo'}
      func(data)
      expect(this.fakeRouter.res.json.lastCall.args[0]).toEqual({...data, ...preset.data})
    })
    test('replaces existing data with preset data if mode !== merge', () => {
      const preset = { mode: 'replace', data: {zip: 'zap', zow: 'wow'} }
      const func = this.AppServer.interceptJsonResponse({res: this.fakeRouter.res, preset})
      const data = {foo: 'bar', baz: 'zip', zing: 'woo'}
      func(data)
      expect(this.fakeRouter.res.json.lastCall.args[0]).toEqual({...preset.data})
    })
  })

  describe('generateAssetEndpoints()', () => {
    test('sets up express serve static with asset data', () => {
      const server = new AppServer()
      const configData = {assets: [{webPath: '/foo', directory: '/bar'}]}
      const mockRouter = {use: stub()}
      const staticStub = stub(express, 'static')
      const projectRoot = locateProjectRoot()
      server.generateAssetEndpoints(mockRouter, configData)
      expect(mockRouter.use.called).toBe(true)
      const assetWebPath = mockRouter.use.args[0][0]
      expect(assetWebPath).toEqual(configData.assets[0].webPath)
      expect(staticStub.args[0][0]).toEqual(`${projectRoot}${configData.assets[0].directory}`)
      staticStub.restore()
    })
  })

  describe('start/stop', () => {
    test('starts and stops a server', async () => {
      const dummyEndpoint = {path: '/', method: 'get', handler: (req, res) => res.send('ok')}
      let server = new AppServer()
      server.configure({endpoints: [new Endpoint(dummyEndpoint)]})
      expect.assertions(3)
      // Server should not respond by default
      try {
        await fetch(`http://localhost:${server.port}/`)
      } catch (e) {
        expect(e).toBeDefined()
      }
      // Server responds when started
      await server.start()
      let response = await fetch(`http://localhost:${server.port}/`)
      let responseText = await response.text()
      expect(responseText).toBe('ok')
      await server.stop()

      // Server no longer responds when stopped
      try {
        await fetch(`http://localhost:${server.port}`)
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })
})
