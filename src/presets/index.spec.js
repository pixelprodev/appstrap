import { ErrPresetNotFound } from '../errors'
import { locateProjectRoot } from '../utilities'
import { Presets } from './'
import { stub } from 'sinon'
import path from 'path'
import Preset from './Preset'

describe('Presets', () => {
  describe('clear()', function () {
    beforeAll(() => {
      this.Presets = new Presets()
      this.Presets._presets = ['foo', 'bar', 'baz']
    })
    test('removes all presets from internal collection', () => {
      expect(this.Presets._presets.length).toBeGreaterThan(0)
      this.Presets.clear()
      expect(this.Presets._presets.length).toBe(0)
    })
  })

  describe('fetch()', function () {
    beforeAll(() => {
      this.Presets = new Presets()
      this.testPreset = new Preset({path: '/', method: 'get', mode: 'merge', data: {foo: 'bar'}})
      this.Presets._presets.push(this.testPreset)
    })
    test('returns -1 if no preset is found for path/method combo', () => {
      expect(this.Presets.fetch({path: '/foo', method: 'get'})).toEqual(-1)
    })
    test('returns Preset that matches path/method combo', () => {
      const preset = this.Presets.fetch({path: '/', method: 'get'})
      expect(preset).toEqual(this.testPreset)
      expect(preset).toBeInstanceOf(Preset)
    })
  })

  describe('_ensureFileExists()', function () {
    beforeAll(() => {
      this.Presets = new Presets()
    })
    test('Throws an error if the file does not exist', () => {
      expect(() => this.Presets._ensureFileExists('/foo/bar')).toThrow(ErrPresetNotFound)
    })
    test('Returns without throwing an error if the file exists', () => {
      const projectRoot = locateProjectRoot()
      const dirParts = [projectRoot, '_test', '_testConfig', 'config.js']
      const filePath = dirParts.join(path.sep)
      expect(() => this.Presets._ensureFileExists(filePath)).not.toThrow()
    })
  })

  describe('_ensureFileIntegrity()', () => {
    test('validates file contents')
  })

  describe('_buildFilePath()', function () {
    beforeEach(() => {
      this.Presets = new Presets()
    })
    test('returns a path for use in loading a preset file', () => {
      const configDir = '/foo/bar/baz'
      const presetName = 'some-preset'
      expect(this.Presets._buildFilePath(presetName, configDir)).toEqual(`${configDir}/presets/${presetName}.js`)
    })
  })

  describe('_getPresetFileData', function () {
    beforeAll(() => {
      this.Presets = new Presets()
      this.mockFileData = [
        {path: '/', mode: 'merge', get: {foo: 'bar'}},
        {path: '/foo', mode: 'replace', get: {baz: 'zip'}},
        {path: '/bar', mode: 'merge', get: {fuzz: 'zow'}, post: {zing: 'ting'}}
      ]
    })
    test('returns list of Presets contains one Preset for each path/method combo', () => {
      const presets = this.Presets._getPresetFileData({fileData: this.mockFileData})
      expect(presets.length).toBe(4)
      presets.forEach(preset => {
        expect(preset).toBeInstanceOf(Preset)
      })
    })
  })

  describe('loadPreset()', function () {
    beforeAll(() => {
      this.Presets = new Presets()
      this.validationStub = stub(this.Presets, 'validateAndLoadPresetFile')
      this.addStub = stub(this.Presets, 'addPresetsToInternalCollection')
      this.Presets.loadPreset('foo')
    })
    test('invokes the loading of presets via validateAndLoadPresetFile', () => {
      expect(this.validationStub.called).toBe(true)
    })
    test('invokes the adding of presets to internal collection', () => {
      expect(this.addStub.called).toBe(true)
    })
    afterAll(() => {
      this.validationStub.restore()
      this.addStub.restore()
    })
  })

  describe('loadPresets()', function () {
    beforeAll(() => {
      this.Presets = new Presets()
      this.validationStub = stub(this.Presets, 'validateAndLoadPresetFile')
      this.combineStub = stub(this.Presets, 'combinePresets')
      this.addStub = stub(this.Presets, 'addPresetsToInternalCollection')
      this.Presets.loadPresets(['foo', 'bar', 'baz'])
    })
    test('loads each preset file in the name array', () => {
      expect(this.validationStub.calledThrice).toBe(true)
    })
    test('combines the presets into one flat set of path/method combos', () => {
      expect(this.combineStub.called).toBe(true)
    })
    test('adds presets to internal collection', () => {
      expect(this.addStub.called).toBe(true)
    })
    afterAll(() => {
      this.validationStub.restore()
      this.combineStub.restore()
      this.addStub.restore()
    })
  })

  describe('addPresetsToInternalCollection', function () {
    beforeAll(() => {
      this.Presets = new Presets()
      this.mockFileData = [
        {path: '/', mode: 'merge', get: {foo: 'bar'}},
        {path: '/foo', mode: 'replace', get: {baz: 'zip'}},
        {path: '/bar', mode: 'merge', get: {fuzz: 'zow'}, post: {zing: 'ting'}}
      ]
      this.presets = this.Presets._getPresetFileData({fileData: this.mockFileData})
    })
    test('inserts a new path/method combo into the internal collection if not already specified', () => {
      expect(this.Presets._presets.length).toBe(0)
      this.Presets.addPresetsToInternalCollection(this.presets)
      expect(this.Presets._presets.length).toBe(4)
    })
    test('overwrites existing preset if a new path/method combo is provided', () => {
      this.Presets.addPresetsToInternalCollection(this.presets)
      expect(this.Presets.fetch({path: '/', method: 'get'}).data).toEqual({foo: 'bar'})
      const newPreset = new Preset({path: '/', mode: 'merge', method: 'get', data: {foo: 'replaced'}})
      this.Presets.addPresetsToInternalCollection([newPreset])
      expect(this.Presets.fetch({path: '/', method: 'get'}).data).toEqual({foo: 'replaced'})
    })
  })

  describe('validateAndLoadPresetFile', function () {
    beforeAll(() => {
      this.Presets = new Presets()
      this.filePathStub = stub(this.Presets, '_buildFilePath')
      this.ensureFileStub = stub(this.Presets, '_ensureFileExists')
      this.dataStub = stub(this.Presets, '_getPresetFileData')
      this.Presets.validateAndLoadPresetFile('')
    })
    test('builds file path based on name', () => {
      expect(this.filePathStub.called).toBe(true)
    })
    test('ensures file exists once path is created', () => {
      expect(this.ensureFileStub.called).toBe(true)
    })
    test('loads preset data from filesystem', () => {
      expect(this.dataStub.called).toBe(true)
    })
    afterAll(() => {
      this.filePathStub.restore()
      this.ensureFileStub.restore()
      this.dataStub.restore()
    })
  })

  describe('combinePresets()', function () {
    beforeAll(() => {
      this.Presets = new Presets()
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
})
