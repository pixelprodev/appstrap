const getProjectRoot = require('../utilities/locateProjectRoot')
const path = require('path')
const Endpoint = require('../Endpoint')
const configLoader = require('./loader')
const loadTestConfig = require('../../_test/_loadTestConfig')
const {
  _ensureFileExists,
  _ensureFileIntegrity,
  _getConfigFileData,
  _getPackageInfo,
  _generateEndpointsFromConfig
} = configLoader._test
const {
  ErrConfigInvalid,
  ErrConfigNotFound
} = require('../errors')
const sinon = require('sinon')
const projectRoot = getProjectRoot()

describe('config loader', () => {
  describe('load()', () => {
    test('config data is loaded and returned with package information', () => {
      const configData = loadTestConfig()
      const configDataProperties = ['bundle', 'assets', 'endpoints', 'name', 'version', 'configFilePath']
      expect.assertions(configDataProperties.length)
      Object.keys(configData).forEach(key => {
        const propertyIndex = configDataProperties.findIndex(prop => prop === key)
        expect(propertyIndex).toBeGreaterThanOrEqual(0)
      })
    })
  })
  describe('private methods', () => {
    describe('_ensureFileExists', () => {
      test('Throws an error if the file does not exist', () => {
        expect(() => _ensureFileExists('/foo/bar')).toThrow(ErrConfigNotFound)
      })
      test('Returns without throwing an error if the file exists', () => {
        const dirParts = [projectRoot, '_test', '_testConfig', 'config.js']
        const filePath = dirParts.join(path.sep)
        expect(() => _ensureFileExists(filePath)).not.toThrow()
      })
    })
    describe('_ensureFileIntegrity', () => {
      test('throws error when config file is missing "assets" property', () => {
        const configData = { bundle: {foo: 'bar'}, endpoints: [] }
        expect(() => _ensureFileIntegrity(configData)).toThrow(ErrConfigInvalid)
      })

      test('throws error when config file is missing "routes" property', () => {
        const configData = { bundle: {foo: 'bar'}, endpoints: {foo: 'bar'} }
        expect(() => _ensureFileIntegrity(configData)).toThrow(ErrConfigInvalid)
      })

      test('function returns without error if all properties are valid', () => {
        const configData = { bundle: {foo: 'bar'}, assets: {foo: 'bar'}, endpoints: [] }
        expect(() => _ensureFileIntegrity(configData)).not.toThrow()
      })
    })
    describe('_getConfigFileData', () => {
      // TODO investigate reference mismatch on _ensureFileIntegrity
      xtest('it validates configData before returning', () => {
        sinon.spy(_ensureFileIntegrity)
        const configData = {bundle: {}, assets: [{}], endpoints: []}
        _getConfigFileData({configData})
        expect(_ensureFileIntegrity.called).toBe(true)
        _ensureFileIntegrity.restore()
      })
    })
    describe('_getPackageInfo', () => {
      test('it returns the package name and version from nearest package json in folder tree', () => {
        const packageInfo = require('../../package.json')
        expect(_getPackageInfo()).toEqual({name: packageInfo.name, version: packageInfo.version})
      })
    })
    describe('_generateEndpointsFromConfig', function () {
      beforeAll(() => {
        this.endpoints = [
          { path: 'some', get: () => {} },
          { path: 'some/nested/path', get: () => {} },
          { path: 'some/nested', get: () => {} }
        ]
        this.generatedEndpoints = _generateEndpointsFromConfig(this.endpoints)
      })
      test('it returns an array of Endpoints', () => {
        this.generatedEndpoints.forEach(endpoint => {
          expect(endpoint).toBeInstanceOf(Endpoint)
        })
      })
      test('the returned array is sorted from longest path to shortest path', () => {
        const expectedPathOrder = ['some/nested/path', 'some/nested', 'some']
        this.generatedEndpoints.forEach((endpoint, indx) => {
          expect(endpoint.path).toEqual(expectedPathOrder[indx])
        })
      })
    })
  })
})
