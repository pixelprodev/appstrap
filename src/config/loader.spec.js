import { locateProjectRoot } from '../utilities'
import path from 'path'
import Endpoint from '../endpoints/Endpoint'
import configLoader from './loader'
import loadTestConfig from '../../_test/_loadTestConfig'
import { ErrConfigInvalid, ErrConfigNotFound } from '../errors'
import sinon from 'sinon'

const projectRoot = locateProjectRoot()

describe('config loader', () => {
  describe('load()', () => {
    test('config data is loaded and returned with package information', () => {
      const configData = loadTestConfig()
      const configDataProperties = ['assets', 'endpoints', 'name', 'version']
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
        expect(() => configLoader._ensureFileExists(path.normalize('/foo/bar'))).toThrow(ErrConfigNotFound)
      })
      test('Returns without throwing an error if the file exists', () => {
        const dirParts = [projectRoot, '_test', '_testConfig', 'config.js']
        const filePath = dirParts.join(path.sep)
        expect(() => configLoader._ensureFileExists(filePath)).not.toThrow()
      })
    })
    describe('_ensureFileIntegrity', () => {
      test('throws error when config file is missing "assets" property', () => {
        const configData = { bundle: {foo: 'bar'}, endpoints: [] }
        expect(() => configLoader._ensureFileIntegrity(configData)).toThrow(ErrConfigInvalid)
      })

      test('throws error when config file is missing "routes" property', () => {
        const configData = { bundle: {foo: 'bar'}, endpoints: {foo: 'bar'} }
        expect(() => configLoader._ensureFileIntegrity(configData)).toThrow(ErrConfigInvalid)
      })

      test('function returns without error if all properties are valid', () => {
        const configData = { bundle: {foo: 'bar'}, assets: {foo: 'bar'}, endpoints: [] }
        expect(() => configLoader._ensureFileIntegrity(configData)).not.toThrow()
      })
    })
    describe('_getConfigFileData', () => {
      // TODO investigate reference mismatch on _ensureFileIntegrity
      xtest('it validates configData before returning', () => {
        sinon.spy(configLoader, '_ensureFileIntegrity')
        const configData = {bundle: {}, assets: [{}], endpoints: []}
        configLoader._getConfigFileData({configData})
        expect(configLoader._ensureFileIntegrity.called).toBe(true)
        configLoader._ensureFileIntegrity.restore()
      })
    })
    describe('_getPackageInfo', () => {
      test('it returns the package name and version from nearest package json in folder tree', () => {
        const packageInfo = require('../../package.json')
        expect(configLoader._getPackageInfo()).toEqual({name: packageInfo.name, version: packageInfo.version})
      })
    })
    describe('_generateEndpointsFromConfig', function () {
      beforeAll(() => {
        this.endpoints = [
          { path: 'some', get: () => {} },
          { path: 'some/nested/path', get: () => {} },
          { path: 'some/nested', get: () => {} }
        ]
        this.generatedEndpoints = configLoader._generateEndpointsFromConfig(this.endpoints)
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
