const Appstrap = require('../lib/Appstrap')
const TestLogger = require('./helpers/TestLogger')
const expect = require('expect')

describe('Appstrap Configuration', () => {
  it('throws a non critical error when incorrect config is provided', () => {
    const strap = new Appstrap({ configDir: './test/configs/doesntExist', logger: TestLogger })
    expect(TestLogger.error.called).toBe(true)
    expect(strap).toBeDefined()
  })
  it('loads the config from a specified directory', () => {
    const strap = new Appstrap({ configDir: './test/configs/default', logger: TestLogger })
    expect(TestLogger.error.called).toBe(false)
    expect(strap.config.files.length).toBeGreaterThan(0)
  })
})
