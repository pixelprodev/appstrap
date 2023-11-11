const Appstrap = require('../lib/Appstrap')
const expect = require('expect')
const strapDefault = require('./helpers/strapDefault')
const { ERR_NO_REPOSITORY_DEFINED, ERR_NO_REPOSITORY_FOUND } = require('../lib/_errors')

describe('Appstrap Configuration', () => {
  it('matches the following shape', () => {
    const strap = strapDefault()
    const expectedKeys = ['files', 'watchEnabled', 'state', 'hostMap', 'repository', 'endpoints', 'fixtures']
    expect(Object.keys(strap.config)).toEqual(expect.arrayContaining(expectedKeys))
  })
  it('throws an error when no repository is provided on instance construction', () => {
    expect(() => new Appstrap()).toThrow(ERR_NO_REPOSITORY_DEFINED)
  })
  it('throws an error when an invalid repository is provided on instance construction', () => {
    expect(() => new Appstrap({ repository: 'path/not/found' })).toThrow(ERR_NO_REPOSITORY_FOUND('path/not/found'))
  })
  it('default configuration values on no argument instance construction', () => {
    const strap = strapDefault()
    expect(strap.config.watchEnabled).toBe(false)
    expect(strap.config.state).toEqual({})
  })
  it('sets the config repository to the provided value on instance construction', () => {
    const strap = strapDefault()
    expect(strap.config.repository.endsWith('test/configs/default')).toBe(true)
  })
  it('populates the files array with path entries for the files in the specified config repository', () => {
    const strap = strapDefault()
    expect(strap.config.files.length).toBeGreaterThan(0)
  })
  it('triggers a reload on handlers when the config watcher signals for reload')
  it('triggers a reload on fixtures when the config watcher signals for reload')
})
