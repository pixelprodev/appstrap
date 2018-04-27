const locateProjectRoot = require('../utilities/locateProjectRoot')
const path = require('path')
const Appstrap = require('../Appstrap')
const AppServer = require('../AppServer')
const pkg = require('../../package.json')

describe('Appstrap', () => {
  describe('constructor', () => {
    test('config is loaded from filepath when provided', () => {
      const projectRoot = locateProjectRoot()
      const dirParts = [projectRoot, 'src', '_test', '_testConfig', 'config.js']
      const configPath = dirParts.join(path.sep)
      const strap = new Appstrap({configPath})
      expect(strap.config.name).toEqual(pkg.name)
      expect(strap.config.version).toEqual(pkg.version)
    })
    test('config is mirrored when passing into constructor', () => {
      const config = {endpoints: []}
      const strap = new Appstrap({config})
      expect(strap.config).toEqual(config)
    })
    test('server is instance of AppServer', () => {
      const strap = new Appstrap({config: {endpoints: []}})
      expect(strap.server).toBeDefined()
      expect(strap.server).toBeInstanceOf(AppServer)
    })
    test('sets initial port to default port when not passed in', () => {
      const strap = new Appstrap({config: {endpoints: []}})
      expect(strap.port).toBe(5000)
    })
    test('sets initial port with provided value when passed in', () => {
      const strap = new Appstrap({port: 3000, config: {endpoints: []}})
      expect(strap.port).toBe(3000)
    })
  })
})
