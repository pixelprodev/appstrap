const Appstrap = require('../')
const testLogger = require('./helpers/TestLogger')
const canStillMakeRequestsUsing = require('./helpers/canStillMakeRequestsUsing')
const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')
const path = require('path')

describe('Configuration', () => {
  describe('loading', () => {
    it('loads the default config file when no config argument is passed to constructor', () => {
      const strap = new Appstrap({ logger: testLogger })
      expect(strap.config.source.endsWith(path.normalize('.appstrap/config.js'))).toBe(true)
      expect(testLogger.error.called).toBe(false)
    })
    it('loads the config file specified in constructor arguments', () => {
      const strap = new Appstrap({ config: './test/_configs/defaultConfig.js', logger: testLogger })
      expect(strap.config.source.endsWith(path.normalize('.appstrap/config.js'))).toBe(false)
      expect(strap.config.source.endsWith(path.normalize('test/_configs/defaultConfig.js'))).toBe(true)
      expect(testLogger.error.called).toBe(false)
    })
    it('outputs error when file not found', async () => {
      const strap = new Appstrap({ config: './some/unknown/path', logger: testLogger })
      expect(testLogger.error.called).toBe(true)
      expect(await canStillMakeRequestsUsing(strap)).toBe(true)
    })
    describe('file validation', () => {
      it('outputs warning when routes in file has no length', async () => {
        const strap = new Appstrap({ config: './test/_configs/emptyRoutesConfig.js', logger: testLogger })
        expect(testLogger.warn.called).toBe(true)
        expect(await canStillMakeRequestsUsing(strap)).toBe(true)
      })
    })
  })
})
