const { fake } = require('sinon')
const Config = require('./config')
const express = require('express')
const fetch = require('isomorphic-fetch')
const path = require('path')
const Presets = require('./presets')
const Request = require('supertest')
const Server = require('./Server')

const configPath = path.resolve('_test/_testConfig/config.js')
const config = new Config({configPath})
const presets = new Presets({ configDir: config.configDir })

describe('Server', () => {
  describe('constructor', () => {
    test('assigns port 5000 when port not specified', () => {
      const server = new Server({config})
      expect(server.port).toBe(5000)
    })
    test('assigns port that is passed in', () => {
      const server = new Server({config, port: 3280})
      expect(server.port).toBe(3280)
    })
    test('creates an internal express server named _app', () => {
      const server = new Server({config})
      expect(server._app).toBeDefined()
      // Function names should match output from express constructor
      const expressServer = express()
      expect(server._app.name).toEqual(expressServer.name)
    })
    test('does not add management interface by default', async () => {
      const server = new Server({config})
      expect(server.enableManagementInterface).toBe(false)

      await Request(server._app)
        .get('/')
        .set('Host', 'appstrap.localhost')
        .expect(500)
    })
    test('adds managment interface when invokedFromCLI', async () => {
      const server = new Server({config, invokedFromCLI: true})
      expect(server.enableManagementInterface).toBe(true)

      await Request(server._app)
        .get('/')
        .set('Host', 'appstrap.localhost')
        .expect(200)
    })
    test('creates router based on config', () => {
      const server = new Server({config})
      expect(server._router.stack).toBeDefined()
      expect(server._router.stack.length).toBeGreaterThan(0)
    })

    test('router implementation is swappable', async () => {
      const server = new Server({config, presets})

      const response = await Request(server._app).get('/')
      expect(response.text).toEqual('{"message":"this is the root"}')

      const newRouter = express.Router({})
      newRouter.get('/', (req, res) => res.json({message: 'swapped'}))

      server._router = newRouter

      const updatedResponse = await Request(server._app).get('/')
      expect(updatedResponse.text).toEqual('{"message":"swapped"}')
    })

    test('creates http server based on internal express app', () => {
      const server = new Server({config})
      expect(server.httpServer).toBeDefined()
    })
  })

  describe('loadEndpoints', () => {
    test('returns an express router instance', () => {
      const server = new Server({config, presets})

      const expressRouter = express.Router({})
      const returnValue = server.loadEndpoints({config})

      expect(expressRouter.name).toEqual(returnValue.name)
    })

    test('returns endpoints according to config file', async () => {
      const server = new Server({config, presets})

      const response = await Request(server._app).get('/')
      expect(response.text).toEqual('{"message":"this is the root"}')
    })

    test('enables client side routing when set in endpoints', async () => {
      const spaConfigPath = path.normalize('_test/_spaConfig/config.js')
      const spaConfig = new Config({configPath: spaConfigPath})
      expect(spaConfig.endpoints.enableClientSideRouting).toBe(true)
      const server = new Server({config: spaConfig, presets})

      const response = await Request(server._app).get('/')
      expect(response.text).toContain('Appstrap Single Page Harness')
    })

    test('creates a catch all endpoint when no endpoints are defined', async () => {
      const emptyConfigPath = path.normalize('_test/_emptyConfig/config.js')
      const emptyConfig = new Config({configPath: emptyConfigPath})
      const server = new Server({config: emptyConfig, presets})

      const response = await Request(server._app).get('/')
      expect(response.text).toEqual('no endpoints defined')
    })

    test('serves static assets when specified in config', async () => {
      const spaConfigPath = path.normalize('_test/_spaConfig/config.js')
      const spaConfig = new Config({configPath: spaConfigPath})
      const server = new Server({config: spaConfig, presets})

      const response = await Request(server._app).get('/assets/bundle.js')
      expect(response.text).toContain('bundle loaded')
      expect(response.text).not.toContain('Appstrap Single Page Harness')
    })
  })

  describe('middleware', () => {
    describe('modifiers', () => {
      test('returns next without calling delay if default args', async () => {
        const server = new Server({config, presets})
        const delay = fake.resolves()
        const next = fake.returns()
        await server.modifierMiddleware({delay})({}, {}, next)
        expect(delay.called).not.toBe(true)
        expect(next.called).toBe(true)
      })
      test('delays response with default delay when not specified', async () => {
        const server = new Server({config, presets})
        const delay = fake.resolves()
        const next = fake.returns()
        await server.modifierMiddleware({latency: true, delay})({}, {}, next)

        // Delay should be called with default delay of 0 ms
        expect(delay.called).toBe(true)
        expect(delay.calledWith(0)).toBe(true)

        expect(next.called).toBe(true)
      })
      test('delays response with specified delay when latency is true', async () => {
        const server = new Server({config, presets})
        const delay = fake.resolves()
        const next = fake.returns()
        await server.modifierMiddleware({latency: true, latencyMS: 3000, delay})({}, {}, next)

        // Delay should be called with default delay of 0 ms
        expect(delay.called).toBe(true)
        expect(delay.calledWith(0)).toBe(false)
        expect(delay.calledWith(3000)).toBe(true)

        expect(next.called).toBe(true)
      })
      test('returns default error when not specified', async () => {
        const server = new Server({config, presets})
        const delay = fake.resolves()
        const next = fake.returns()
        const sendStatus = fake.returns()
        await server.modifierMiddleware({error: true, delay})({}, {sendStatus}, next)

        expect(sendStatus.called).toBe(true)
        expect(sendStatus.calledWith(500)).toBe(true)
        expect(next.called).toBe(false)
      })
      test('returns specified custom error when error is true', async () => {
        const server = new Server({config, presets})
        const delay = fake.resolves()
        const next = fake.returns()
        const sendStatus = fake.returns()
        await server.modifierMiddleware({error: true, errorStatus: 401, delay})({}, {sendStatus}, next)

        expect(sendStatus.called).toBe(true)
        expect(sendStatus.calledWith(401)).toBe(true)
        expect(next.called).toBe(false)
      })
    })
    describe('state', () => {
      test('adds `state` property to req object', () => {
        const server = new Server({config, presets})
        const fakeReq = {}
        server.stateProviderMiddleware()(fakeReq, {}, fake)
        expect(fakeReq.state).toBeDefined()
      })
    })
    describe('pre-handler', () => {})
  })

  describe('start', () => {
    test('starts a server successfully', async () => {
      const server = new Server({config, presets, port: 3100})
      await server.start()

      const response = await fetch(`http://localhost:${server.port}`)
      const text = await response.text()
      expect(text).toEqual('{"message":"this is the root"}')
      await server.stop()
    })
    test('port automatically swapped when already taken', async () => {
      const server1 = new Server({config, presets, port: 3002})
      await server1.start()
      expect(server1.port).toEqual(3002)

      const server2 = new Server({config, presets, port: 3002})
      await server2.start()
      expect(server2.port).not.toEqual(3002)

      // ensures we arent sharing the same port object
      expect(server1.port).not.toBe(server2.port)

      await server1.stop()
      await server2.stop()
    })

    // TODO add this once we replace default console.log statements with another logger
    //   reason: https://gyandeeps.com/console-stubbing/
    // test('no console output displayed when not invoked from CLI')
    // test('console output generated for user info when invoked from CLI')
  })

  describe('stop', () => {
    test('stops server successfully', async () => {
      const server = new Server({config, presets})
      await server.start()
      expect(server.httpServer.address()).toBeTruthy()
      await server.stop()
      expect(server.httpServer.address()).toBeFalsy()
    })
  })
})
