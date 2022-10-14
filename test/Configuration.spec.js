const Appstrap = require('../lib/Appstrap')
const TestLogger = require('./helpers/TestLogger')

describe('Appstrap Configuration', () => {
  it('throws a non critical error when incorrect config is provided', () => {
    const strap = new Appstrap({ configDir: './test/configs/doesntExist', logger: TestLogger })
    // todo whats a better way to look at this error?
    expect(TestLogger.error.called).toBe(true)
    expect(strap).toBeDefined()
  })
  it('loads the config from a specified directory', () => {
    const strap = new Appstrap({ configDir: './test/configs/default', logger: TestLogger })
    console.log(strap.fixtures)
  })
})
