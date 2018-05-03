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

  describe('reloadEndpoints', () => {

  })
  describe('loadEndpoints', () => {

  })

  describe('getSpaHarnessMockup()', () => {

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
