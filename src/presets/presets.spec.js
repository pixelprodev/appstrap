import { ErrPresetNotFound } from '../errors'
import { Presets } from './'
import { stub } from 'sinon'
import path from 'path'
import Preset from './Preset'

const configDir = path.normalize('_test/_testConfig')
const testPresetFormat = {path: '/', method: 'get', mode: 'merge', data: {foo: 'bar'}}
const testPreset = new Preset(testPresetFormat)

describe('Presets', () => {
  describe('clear', () => {
    test('removes all presets from internal collection', () => {
      const presets = new Presets({configDir})
      presets._presets = ['foo', 'bar', 'baz']
      expect(presets._presets).toHaveLength(3)
      presets.clear()
      expect(presets._presets).toHaveLength(0)
    })
  })

  describe('fetch', () => {
    test('returns -1 if no preset is found for path/method combo', () => {
      const presets = new Presets({configDir})
      expect(presets.fetch({path: '/foo', method: 'get'})).toEqual(-1)
    })
    test('returns Preset that matches path/method combo', () => {
      const presets = new Presets({configDir})
      presets._presets.push(testPreset)
      const preset = presets.fetch({path: '/', method: 'get'})
      expect(preset).toEqual(testPreset)
      expect(preset).toBeInstanceOf(Preset)
    })
  })

  describe('_ensureFileExists', () => {
    test('Throws an error if the file does not exist', () => {
      const presets = new Presets({configDir})
      expect(() => presets._ensureFileExists('/foo/bar')).toThrow(ErrPresetNotFound)
    })
    test('Returns without throwing an error if the file exists', () => {
      const presets = new Presets({configDir})
      const presetPath = path.normalize(`${configDir}/presets/furious-frog.js`)
      expect(() => presets._ensureFileExists(presetPath)).not.toThrow()
    })
  })

  describe('_getPresetFileData', () => {
    test('returns list of Presets contains one Preset for each path/method combo', () => {
      const presets = new Presets({configDir})
      const fileData = [
        {path: '/', mode: 'merge', get: {foo: 'bar'}},
        {path: '/foo', mode: 'replace', get: {baz: 'zip'}},
        {path: '/bar', mode: 'merge', get: {fuzz: 'zow'}, post: {zing: 'ting'}}
      ]

      const loadedPresets = presets._getPresetFileData({fileData, name: 'Test File'})
      expect(loadedPresets.length).toBe(4)
      loadedPresets.forEach(preset => {
        expect(preset.name).toBe('Test File')
        expect(preset).toBeInstanceOf(Preset)
      })
    })
  })

  describe('addPresetsToInternalCollection', () => {
    test('inserts a new path/method combo into the internal collection if not already specified', () => {
      const presets = new Presets({configDir})
      const fileData = [
        {path: '/', mode: 'merge', get: {foo: 'bar'}},
        {path: '/foo', mode: 'replace', get: {baz: 'zip'}},
        {path: '/bar', mode: 'merge', get: {fuzz: 'zow'}, post: {zing: 'ting'}}
      ]
      const loadedPresets = presets._getPresetFileData({fileData})

      expect(presets._presets.length).toBe(0)
      presets.addPresetsToInternalCollection(loadedPresets)
      expect(presets._presets.length).toBe(4)
    })
    test('overwrites existing preset if a new path/method combo is provided', () => {
      const presets = new Presets({configDir})
      const fileData = [
        {path: '/', mode: 'merge', get: {foo: 'bar'}},
        {path: '/foo', mode: 'replace', get: {baz: 'zip'}},
        {path: '/bar', mode: 'merge', get: {fuzz: 'zow'}, post: {zing: 'ting'}}
      ]
      const loadedPresets = presets._getPresetFileData({fileData})
      presets.addPresetsToInternalCollection(loadedPresets)
      expect(presets.fetch({path: '/', method: 'get'}).data).toEqual({foo: 'bar'})
      const newPreset = new Preset({path: '/', mode: 'merge', method: 'get', data: {foo: 'replaced'}})
      presets.addPresetsToInternalCollection([newPreset])
      expect(presets.fetch({path: '/', method: 'get'}).data).toEqual({foo: 'replaced'})
    })
  })

  describe('combinePresets', function () {
    beforeAll(() => {
      this.Presets = new Presets({configDir})
      const mockData1 = [
        {path: '/', mode: 'merge', get: {foo: 'bar'}},
        {path: '/foo', mode: 'merge', get: {baz: 'zip'}},
        {path: '/bar', mode: 'merge', get: {fuzz: 'zow'}}
      ]
      const mockData2 = [
        {path: '/', mode: 'merge', get: {foo: 'bar', wang: 'zang'}},
        {path: '/foo', mode: 'replace', get: {buzz: 'zip'}},
        {path: '/bar', mode: 'merge', get: {fuzz: 'zow'}}
      ]
      const mockData3 = [
        {path: '/', mode: 'merge', get: {foo: 'buz', zow: 'zam'}},
        {path: '/foo', mode: 'merge', get: {bar: 'zong'}},
        {path: '/bar', mode: 'replace', get: {fuzz: 'zow'}}
      ]
      this.presetCollection = [
        this.Presets._getPresetFileData({fileData: mockData1}),
        this.Presets._getPresetFileData({fileData: mockData2}),
        this.Presets._getPresetFileData({fileData: mockData3})
      ]
    })
    test('takes an array of preset collections and merges path/method combos left to right', () => {
      const combinedPresets = this.Presets.combinePresets(this.presetCollection)
      combinedPresets.forEach(preset => {
        expect(preset).toBeInstanceOf(Preset)
      })
    })
    test('combined combos with m + m + m end up as m<-m<-m', () => {
      const combinedPresets = this.Presets.combinePresets(this.presetCollection)
      const fullMerge = combinedPresets.find(preset => preset.path === '/')
      expect(fullMerge.data).toEqual({foo: 'buz', wang: 'zang', zow: 'zam'})
    })
    test('combined combos with m + r + m end up as r<-m', () => {
      const combinedPresets = this.Presets.combinePresets(this.presetCollection)
      const replaceMerge = combinedPresets.find(preset => preset.path === '/foo')
      expect(replaceMerge.data).toEqual({buzz: 'zip', bar: 'zong'})
    })
    test('combined combos with m + m + r end up as r', () => {
      const combinedPresets = this.Presets.combinePresets(this.presetCollection)
      const replaced = combinedPresets.find(preset => preset.path === '/bar')
      expect(replaced.data).toEqual({fuzz: 'zow'})
    })
  })

  describe('getStatus()', function () {
    beforeAll(() => {
      this.Presets = new Presets({configDir})
    })
    test('returns active presets, availablePresets, and activeGroups', () => {
      const status = this.Presets.getStatus()
      expect(status.activeGroups).toBeDefined()
      expect(status.activePresets).toBeDefined()
      expect(status.availablePresets).toBeDefined()
    })
  })

  describe('activatePresetGroup()', function () {
    beforeAll(() => {
      this.Presets = new Presets({configDir})
      this.setInternalStub = stub(this.Presets, 'groupPresetsAndSetInternal')
    })
    test('adds new name to end of group array to preserve stacking order', () => {
      this.Presets.activatePresetGroup({name: 'test1'})
      this.Presets.activatePresetGroup({name: 'test2'})
      expect(this.Presets._activePresetGroups).toHaveLength(2)
      expect(this.Presets._activePresetGroups).toEqual(['test1', 'test2'])
    })
    test('sets internal presets', () => {
      this.Presets.activatePresetGroup({name: 'test1'})
      expect(this.setInternalStub.called).toBe(true)
    })
  })

  describe('deactivatePresetGroup', function () {
    beforeAll(() => {
      this.Presets = new Presets({configDir})
      this.setInternalStub = stub(this.Presets, 'groupPresetsAndSetInternal')
    })
    test('removes name from activePresetGroups', () => {
      this.Presets._activePresetGroups = ['foo', 'bar', 'baz']
      this.Presets.deactivatePresetGroup({name: 'bar'})
      expect(this.Presets._activePresetGroups).toEqual(['foo', 'baz'])
    })
    test('sets internal presets', () => {
      this.Presets.activatePresetGroup({name: 'test1'})
      expect(this.setInternalStub.called).toBe(true)
    })
  })

  describe('groupPresetsAndSetInternal()', function () {
    test('array returned does not have object references to availablePresets')
  })
})
