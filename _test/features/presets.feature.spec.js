import Appstrap from '../../src/Appstrap'
import Presets from '../../src/presets'
import Request from 'supertest'
import { stub } from 'sinon'

describe('Presets feature', () => {
  describe('Preloaded Presets (management interface tests)', function () {
    beforeAll(() => {
      this.stubs = {
        presets: {
          preloadPresets: stub(Presets, 'preloadPresets')
        }
      }
      this.server = new Appstrap({
        configPath: './_test/_testConfig/config.js', invokedFromCLI: true
      })
      this.appServer = this.server._AppServer
    })
    test('management interface is active', async () => {
      const fakeServer = Request(this.appServer)
      const response = await fakeServer.get('/').set('host', 'appstrap.localhost')
      expect(response.text.includes('Appstrap Management Interface ')).toBe(true)
    })
    test('preloads presets on start', () => {
      expect(this.stubs.presets.preloadPresets.called).toBe(true)
    })
  })
})
