import Endpoints from './Endpoints'
import AppServer from './AppServer'
import Config from './config/loader'
import { Appstrap } from './Appstrap'

describe('Appstrap', () => {
  describe('port', () => {
    test('sets initial port to default port when not passed in', () => {
      const strap = new Appstrap({config: {}})
      expect(strap.port).toBe(5000)
    })
    test('sets initial port with provided value when passed in', () => {
      const strap = new Appstrap({port: 3000, config: {}})
      expect(strap.port).toBe(3000)
    })
  })

  describe('start', () => {
    test('Exposes AppServer.start', () => {
      const strap = new Appstrap({config: {}})
      expect(strap.start.toString()).toEqual(AppServer.start.toString())
    })
  })

  describe('stop', () => {
    test('Exposes AppServer.stop', () => {
      const strap = new Appstrap({config: {}})
      expect(strap.stop.toString()).toEqual(AppServer.stop.toString())
    })
  })

  describe('reload', () => {
    test('Exposes Config.reload', () => {
      const strap = new Appstrap({config: {}})
      expect(strap.reset.toString()).toEqual(Config.reload.toString())
    })
  })

  describe('setModifier', () => {
    test('Exposes Endpoints.setModifier', () => {
      const strap = new Appstrap({config: {}})
      expect(strap.setModifier.toString()).toEqual(Endpoints.setModifier.toString())
    })
  })

  describe('clearModifier', () => {
    test('Exposes Endpoints.clearModifier', () => {
      const strap = new Appstrap({config: {}})
      expect(strap.clearModifier.toString()).toEqual(Endpoints.clearModifier.toString())
    })
  })
})
