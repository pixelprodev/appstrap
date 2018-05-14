import Appstrap from '../../src/Appstrap'
import Presets from '../../src/presets'
import Request from 'supertest'
import getPresets from '../getPresets'
import { spy } from 'sinon'

describe('Presets feature', () => {
  describe('Preloaded Presets (management interface tests)', function () {
    beforeAll(async () => {
      this.spies = {
        presets: {
          preloadPresets: spy(Presets, 'preloadPresets')
        }
      }
      this.server = new Appstrap({
        configPath: './_test/_testConfig/config.js', invokedFromCLI: true
      })
      this.appServer = this.server._AppServer
      this.fakeServer = Request(this.appServer)
      this.defaultResponse = await this.fakeServer.get('/')
    })
    test('management interface is active', async () => {
      const response = await this.fakeServer.get('/').set('host', 'appstrap.localhost')
      expect(response.text.includes('Appstrap Management Interface ')).toBe(true)
    })
    test('preloads presets on start', () => {
      expect(this.spies.presets.preloadPresets.called).toBe(true)
    })
    describe('Preloaded preset defaults', () => {
      test('no presets to be active when server starts', async () => {
        const { text } = await this.fakeServer
          .get('/data/presets').set('host', 'appstrap.localhost')
        let data = JSON.parse(text)
        expect(data.activeGroups).toHaveLength(0)
        expect(data.activePresets).toHaveLength(0)
      })
      test('available presets are populated with all possible endpoint/method combos', async () => {
        const presetFiles = await getPresets()
        const totalOptions = Object.values(presetFiles)
          .reduce((acc, {path, mode, ...methods}) => [...acc, ...Object.values(methods)], [])
        const { text } = await this.fakeServer
          .get('/data/presets').set('host', 'appstrap.localhost')
        let data = JSON.parse(text)
        expect(data.availablePresets.length).toEqual(totalOptions.length)
      })
    })

    describe('working with a single preset', () => {
      describe('using node api commands', () => {
        beforeEach(async () => {
          await this.server.reset()
        })
        test('payload is merged when a preset with merge combo is active', async () => {
          const presetFiles = await getPresets()
          await this.server.loadPreset('furious-frog')
          const furiousFrogResponse = presetFiles['furious-frog'].find(({path}) => path === '/').get
          const presetEnhancedResponse = await this.fakeServer.get('/')
          expect(JSON.parse(presetEnhancedResponse.text))
            .toEqual({...JSON.parse(this.defaultResponse.text), ...furiousFrogResponse})
        })
        test('payload is replaced when a preset with replace combo is active', async () => {
          const presetFiles = await getPresets()
          await this.server.loadPreset('rambunctious-rhino')
          const rambunctiousRhinoResponse = presetFiles['rambunctious-rhino'].find(({path}) => path === '/').get
          const presetEnhancedResponse = await this.fakeServer.get('/')
          expect(JSON.parse(presetEnhancedResponse.text)).not.toEqual(this.defaultResponse)
          expect(JSON.parse(presetEnhancedResponse.text)).toEqual(rambunctiousRhinoResponse)
        })
      })
      describe('using management ui routes', () => {
        test('payload is merged when a preset with merge combo is active', async () => {
          const presetFiles = await getPresets()
          await this.fakeServer
            .put('/data/presets')
            .set('host', 'appstrap.localhost')
            .send({name: 'furious-frog', active: true})
          const furiousFrogResponse = presetFiles['furious-frog'].find(({path}) => path === '/').get
          const presetEnhancedResponse = await this.fakeServer.get('/')
          expect(JSON.parse(presetEnhancedResponse.text))
            .toEqual({...JSON.parse(this.defaultResponse.text), ...furiousFrogResponse})
        })
        test('preset is deactivated when management interface route indicates active false', async () => {
          await this.fakeServer
            .put('/data/presets')
            .set('host', 'appstrap.localhost')
            .send({name: 'furious-frog', active: false})
          const response = await this.fakeServer.get('/')
          expect(response.text).toEqual(this.defaultResponse.text)
        })
        test('payload is replaced when a preset with replace combo is active', async () => {
          const presetFiles = await getPresets()
          await this.fakeServer
            .put('/data/presets')
            .set('host', 'appstrap.localhost')
            .send({name: 'rambunctious-rhino', active: true})
          const rambunctiousRhinoResponse = presetFiles['rambunctious-rhino'].find(({path}) => path === '/').get
          const presetEnhancedResponse = await this.fakeServer.get('/')
          expect(JSON.parse(presetEnhancedResponse.text)).not.toEqual(this.defaultResponse)
          expect(JSON.parse(presetEnhancedResponse.text)).toEqual(rambunctiousRhinoResponse)
        })
      })
    })
  })
})
