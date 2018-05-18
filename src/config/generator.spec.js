/* eslint no-eval: 0 */
import ConfigGenerator from './generator'

describe('ConfigGenerator', () => {
  describe('generateConfigContents', () => {
    test('Generates empty config when no bundle defined', () => {
      let output = ConfigGenerator.generateConfigContents()
      output = eval(output)
      expect(output.bundle).not.toBeDefined()
      expect(Array.isArray(output.assets)).toBe(true)
      expect(output.assets.length).toBe(0)
      expect(Array.isArray(output.endpoints)).toBe(true)
      expect(output.endpoints.length).toBe(0)
    })
    test('Generates spa app config when bundle defined', () => {
      const path = './foo/bundle.js'
      const host = '#host'
      const splitPath = path.split('/')
      const webPath = `/${splitPath.pop()}`
      const directory = splitPath.join('/')
      let output = ConfigGenerator.generateConfigContents({path, host})
      output = eval(output)
      expect(output.bundle).toBeDefined()
      expect(output.bundle.webPath).toEqual(path)
      expect(output.bundle.host).toEqual(host)
      expect(Array.isArray(output.assets)).toBe(true)
      expect(output.assets.length).not.toBe(0)
      expect(output.assets[0].webPath).toEqual(webPath)
      expect(output.assets[0].directory).toEqual(directory)
      expect(Array.isArray(output.endpoints)).toBe(true)
      expect(output.endpoints.length).toBe(0)
    })
  })
})
