import Appstrap from '../../src/Appstrap'
import Request from 'supertest'
import Presets from '../../src/presets'
import path from 'path'
import {getPresetData} from '../presetHelpers'

describe('Presets feature', () => {
  describe('case insensitive paths', function () {
    test('lower case route still matches preset with upper case letters')
  })
  describe('Appstrap.reset()', function () {
    beforeAll(async () => {
      this.server = new Appstrap({configPath: path.normalize('./_test/_testConfig/config.js')})
      Presets.preloadPresets()
      await this.server.loadPreset('furious-frog')
      this.server.reset()
    })
    test('active presets are removed', () => {
      console.log(this.server)
      expect(Presets._presets).toHaveLength(0)
    })
    test('active preset groups are reset', () => {
      expect(Presets._activePresetGroups).toHaveLength(0)
    })
    test('preloaded presets are not removed', () => {
      expect(Presets._availablePresets).not.toHaveLength(0)
    })
  })
  describe('single preset (using loadPreset)', function () {
    beforeAll(async () => {
      this.server = new Appstrap({configPath: './_test/_testConfig/config.js'})
      this.routes = Request(this.server._app)
      const {text} = await this.routes.get('/')
      this.baseResponse = JSON.parse(text)
    })
    test('active preset merges onto base response payload', async () => {
      const presetResponse = getPresetData('furious-frog')
      await this.server.loadPreset('furious-frog')
      const enhancedResponse = await this.routes.get('/')
      expect(enhancedResponse.text).toEqual(JSON.stringify({...this.baseResponse, ...presetResponse}))
    })
    test('active preset replaces base response payload', async () => {
      const presetResponse = getPresetData('rambunctious-rhino')
      await this.server.loadPreset('rambunctious-rhino')
      const enhancedResponse = await this.routes.get('/')
      Object.keys(this.baseResponse).forEach(key => expect(enhancedResponse.text).not.toContain(key))
      expect(enhancedResponse.text).toEqual(JSON.stringify(presetResponse))
    })
    test('deactivating preset returns base response payload', async () => {
      await this.server.loadPreset('furious-frog')
      this.server.reset()
      const response = await this.routes.get('/')
      expect(response.text).toEqual(JSON.stringify(this.baseResponse))
    })
    afterEach(() => {
      this.server.reset()
    })
  })
  describe('preset composition (using loadPresets)', function () {
    beforeAll(async () => {
      this.server = new Appstrap({configPath: './_test/_testConfig/config.js'})
      this.routes = Request(this.server._app)
      const {text} = await this.routes.get('/')
      this.baseResponse = JSON.parse(text)
    })
    test('activating presets with modes of merge <- merge <- merge combine appropriately on base', async () => {
      const mergedPresets = {
        ...getPresetData('curious-coyote'),
        ...getPresetData('furious-frog'),
        ...getPresetData('laughing-leopard')
      }
      await this.server.loadPresets(['curious-coyote', 'furious-frog', 'laughing-leopard'])
      const response = await this.routes.get('/')
      expect(response.text).toEqual(JSON.stringify({...this.baseResponse, ...mergedPresets}))
    })
    test('activating presets with modes of merge <- replace <- merge result in replace <- merge', async () => {
      const replacedAndMerged = {
        ...getPresetData('rambunctious-rhino'),
        ...getPresetData('laughing-leopard')
      }
      await this.server.loadPresets(['curious-coyote', 'rambunctious-rhino', 'laughing-leopard'])
      const response = await this.routes.get('/')
      expect(response.text).toEqual(JSON.stringify({...replacedAndMerged}))
    })
    test('activating presets with modes of merge <- merge <- replace result in replace only', async () => {
      const replaced = getPresetData('rambunctious-rhino')

      await this.server.loadPresets(['curious-coyote', 'laughing-leopard', 'rambunctious-rhino'])
      const response = await this.routes.get('/')
      expect(response.text).toEqual(JSON.stringify({...replaced}))
    })
    afterEach(() => {
      this.server.reset()
    })
  })
  describe('Preset management via node api', function () {
    beforeAll(async () => {
      this.server = new Appstrap({configPath: './_test/_testConfig/config.js'})
      this.routes = Request(this.server._app)
      const {text} = await this.routes.get('/')
      this.baseResponse = JSON.parse(text)
    })
    test('activating a preset updates endpoint behavior as expected', async () => {
      const presetResponse = getPresetData('furious-frog')
      await this.server.loadPreset('furious-frog')
      const enhancedResponse = await this.routes.get('/')
      expect(enhancedResponse.text).toEqual(JSON.stringify({...this.baseResponse, ...presetResponse}))
    })
    afterEach(() => {
      this.server.reset()
    })
  })
})
