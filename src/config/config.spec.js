import { ErrConfigInvalid, ErrConfigNotFound } from '../errors'
import { fake } from 'sinon'
import Config from './index'
import Endpoint from '../endpoints/Endpoint'
import path from 'path'

const configPath = path.normalize('_test/_testConfig/config.js')

describe('config loader', () => {
  describe('private methods', () => {
    describe('_ensureFileExists', () => {
      test('Throws an error if the file does not exist', () => {
        const config = new Config({configPath})
        expect(() => config._ensureFileExists(path.normalize('/foo/bar'))).toThrow(ErrConfigNotFound)
      })
      test('Returns without throwing an error if the file exists', () => {
        const config = new Config({configPath})
        expect(() => config._ensureFileExists(configPath)).not.toThrow()
      })
    })
    describe('_ensureFileIntegrity', () => {
      test('throws error when config file is missing "assets" property', () => {
        const configData = { bundle: {foo: 'bar'}, endpoints: [] }
        const config = new Config({configData})
        expect(() => config._ensureFileIntegrity(configData)).toThrow(ErrConfigInvalid)
      })

      test('function returns without error if all properties are valid', () => {
        const configData = { bundle: {foo: 'bar'}, assets: {foo: 'bar'}, endpoints: [] }
        const config = new Config({configData})
        expect(() => config._ensureFileIntegrity(configData)).not.toThrow()
      })
    })

    describe('config with catch-all endpoint defined', () => {
      test('warns when using catch-all when bundle defined', () => {
        const fakeWarn = fake.returns()
        const config = new Config({
          configPath: path.normalize('_test/_catchAllConfig/catch-all-spa.js'),
          warnAboutCatchAllEndpoint: fakeWarn
        })
        expect(config.configDir).toEqual('_test/_catchAllConfig')
        expect(fakeWarn.called).toBe(true)
      })
      test('does not warn when using catch all when bundle not defined', () => {
        const fakeWarn = fake.returns()
        const config = new Config({
          configPath: path.normalize('_test/_catchAllConfig/catch-all-non-spa.js'),
          warnAboutCatchAllEndpoint: fakeWarn
        })
        expect(config.configDir).toEqual('_test/_catchAllConfig')
        expect(fakeWarn.called).toBe(false)
      })
    })

    describe('_generateEndpointsFromConfig', function () {
      beforeAll(() => {
        this.config = new Config({configPath})
        this.endpoints = [
          { path: 'some', get: () => {} },
          { path: 'some/nested/path', get: () => {} },
          { path: 'some/nested', get: () => {} }
        ]
        this.generatedEndpoints = this.config._generateEndpointsFromConfig(this.endpoints)
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
