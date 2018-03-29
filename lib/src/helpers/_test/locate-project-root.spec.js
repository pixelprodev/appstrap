const fs = require('fs-extra')
const locateProjectRoot = require('../locate-project-root')

const defaultDir = process.cwd()

describe('locate project root', () => {
  afterEach(() => {
    process.chdir(defaultDir)
  })
  test('Locates project root when package.json is present in cwd', () => {
    expect(fs.existsSync(`${defaultDir}/package.json`)).toBe(true)
    expect(locateProjectRoot()).toEqual(process.cwd())
  })
  test('Locates project root when cwd is in a child folder of parent that contains package.json', () => {
    process.chdir('./lib/src/_test')
    expect(locateProjectRoot()).toEqual(defaultDir)
  })
})
