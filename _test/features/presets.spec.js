import Appstrap from '../../src/Appstrap'
import Request from 'supertest'
import path from 'path'
import {getPresetData} from '../presetHelpers'

const configPath = path.normalize('./_test/_testConfig/config.js')

describe('Presets feature', () => {
  describe('case insensitive paths', function () {
    test('lower case route still matches preset with upper case letters')
  })

  /*
  Demonstrates expected results when a user calls Appstrap.reset when it comes to presets.
    It should remove any active presets (and their groups), but not affect any preloaded presets
    because they are only preloaded when the constructor runs.
  */
  describe('Appstrap.reset effects', () => {
    test('active presets are removed', async () => {
      const server = new Appstrap({configPath, invokedFromCLI: true})
      await server.loadPreset('furious-frog')
      expect(server.presets._presets).not.toHaveLength(0)
      server.reset()
      expect(server.presets._presets).toHaveLength(0)
    })
    test('active preset groups are reset', async () => {
      const server = new Appstrap({configPath, invokedFromCLI: true})
      await server.loadPreset('furious-frog')
      server.reset()
      expect(server.presets._activePresetGroups).toHaveLength(0)
    })
    test('preloaded presets are not removed', async () => {
      const server = new Appstrap({configPath, invokedFromCLI: true})
      await server.loadPreset('furious-frog')
      server.reset()
      expect(server.presets._availablePresets).not.toHaveLength(0)
    })
  })

  /*
  Demonstrates expected results when working with a single preset at a time.
  */
  describe('single preset (using loadPreset)', () => {
    test('active preset merges onto base response payload', async () => {
      const server = new Appstrap({configPath})
      // get base response payload
      const baseResponse = await Request(server.middleware).get('/')
      // get preset data that should be merged
      const presetResponse = getPresetData('furious-frog')
      // load preset into route and re-fetch
      await server.loadPreset('furious-frog')
      const enhancedResponse = await Request(server.middleware).get('/')

      const expectedResult = JSON.stringify({...JSON.parse(baseResponse.text), ...presetResponse})
      expect(enhancedResponse.text).toEqual(expectedResult)
    })
    test('active preset replaces base response payload', async () => {
      const server = new Appstrap({configPath})
      // get base response payload
      const baseResponse = await Request(server.middleware).get('/')
      // get preset data that should replace baseResponse
      const presetResponse = getPresetData('rambunctious-rhino')

      // load preset into route and re-fetch
      await server.loadPreset('rambunctious-rhino')
      const enhancedResponse = await Request(server.middleware).get('/')

      Object.keys(JSON.parse(baseResponse.text))
        .forEach(key => expect(enhancedResponse.text).not.toContain(key))
      expect(enhancedResponse.text).toEqual(JSON.stringify(presetResponse))
    })
    test('deactivating preset returns base response payload', async () => {
      const server = new Appstrap({configPath})
      // get base response payload
      const baseResponse = await Request(server.middleware).get('/')
      // load preset into route
      await server.loadPreset('furious-frog')
      // remove preset
      server.reset()

      // refetch and compare against original base
      const response = await Request(server.middleware).get('/')
      expect(response.text).toEqual(baseResponse.text)
    })
  })

  describe('preset composition (using loadPresets)', () => {
    test('activating presets with modes of merge <- merge <- merge combine appropriately on base', async () => {
      const server = new Appstrap({configPath})
      // get base response payload
      const baseResponse = await Request(server.middleware).get('/')
      // get preset data
      const mergedPresets = {
        ...getPresetData('curious-coyote'),
        ...getPresetData('furious-frog'),
        ...getPresetData('laughing-leopard')
      }

      await server.loadPresets(['curious-coyote', 'furious-frog', 'laughing-leopard'])
      const response = await Request(server.middleware).get('/')

      const expectedResult = JSON.stringify({...JSON.parse(baseResponse.text), ...mergedPresets})
      expect(response.text).toEqual(expectedResult)
    })
    test('activating presets with modes of merge <- replace <- merge result in replace <- merge', async () => {
      const server = new Appstrap({configPath})
      // get base response payload
      const baseResponse = await Request(server.middleware).get('/')
      // get preset data
      const replacedAndMerged = {
        ...getPresetData('rambunctious-rhino'),
        ...getPresetData('laughing-leopard')
      }
      await server.loadPresets(['rambunctious-rhino', 'laughing-leopard'])
      const response = await Request(server.middleware).get('/')

      const expectedResult = JSON.stringify({...replacedAndMerged})
      expect(response.text).toEqual(expectedResult)
      expect(response.text).not.toContain(baseResponse.text)
    })
    test('activating presets with modes of merge <- merge <- replace result in replace only', async () => {
      const server = new Appstrap({configPath})
      const replaced = getPresetData('rambunctious-rhino')

      await server.loadPresets(['curious-coyote', 'laughing-leopard', 'rambunctious-rhino'])
      const response = await Request(server.middleware).get('/')
      expect(response.text).toEqual(JSON.stringify({...replaced}))
    })
  })
  describe('Preset management via node api', () => {
    test('activating a preset updates endpoint behavior as expected', async () => {
      const server = new Appstrap({configPath})
      // get base response payload
      const baseResponse = await Request(server.middleware).get('/')
      // get preset data that should be merged
      const presetResponse = getPresetData('furious-frog')
      // load preset into route and re-fetch
      await server.loadPreset('furious-frog')
      const enhancedResponse = await Request(server.middleware).get('/')

      const expectedResult = JSON.stringify({...JSON.parse(baseResponse.text), ...presetResponse})
      expect(enhancedResponse.text).toEqual(expectedResult)
    })
  })
})
