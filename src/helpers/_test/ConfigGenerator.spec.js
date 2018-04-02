const ConfigGenerator = require('../ConfigGenerator')

describe('ConfigGenerator', () => {
  describe('generateConfigContents', () => {
    test('output', () => {
      console.log(ConfigGenerator.generateConfigContents())
      console.log(ConfigGenerator.generateConfigContents({path: './foo/bar', host: '#host'}))
    })
  })
})
