const Appstrap = require('../')
const testLogger = require('./helpers/TestLogger')

describe('Configuration', () => {
  describe('loading', () => {
    it('loads the default config file when no config argument is passed to constructor', () => {
      const strap = new Appstrap({ logger: testLogger })
      expect(strap.config.source.endsWith('.appstrap/config.js')).toBe(true)
      expect(testLogger.error.called).toBe(false)
    })
    it('loads the config file specified in constructor arguments', () => {
      const strap = new Appstrap({ config: './test/_configs/defaultConfig.js', logger: testLogger })
      expect(strap.config.source.endsWith('.appstrap/config.js')).toBe(false)
      expect(strap.config.source.endsWith('test/_configs/defaultConfig.js')).toBe(true)
      expect(testLogger.error.called).toBe(false)
    })
    it('outputs error when file not found', () => {
      const strap = new Appstrap({ config: './some/unknown/path', logger: testLogger })
      expect(strap).toBeDefined() // should still output an empty express object and be valid for middleware insertion
      expect(testLogger.error.called).toBe(true)
    })
    describe('file validation', () => {
      it('outputs warning when file is missing required endpoints - returns no handlers')
    })
  })
  describe('static assets', () => {

  })
  describe('endpoints', () => {

  })
})
