const AppServer = require('./AppServer')
const Endpoint = require('./endpoints/Endpoint')
const Request = require('supertest')

xdescribe('AppServer', () => {
  describe('constructor', () => {
    test('returns an express server that responds to all get calls with "Welcome to appstrap!"', async () => {
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

  describe('load / reloadEndpoints', function () {
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
