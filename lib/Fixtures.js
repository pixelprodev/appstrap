const Fixture = require('./Fixture')
const { loadFile } = require('./_helpers')

class Fixtures {
  constructor ({ config, logger }) {
    this.config = config
    this.logger = logger
    this.active = new Set()
    this.buildCollection()
  }

  buildCollection () {
    const filePaths = this.config.files.filter(path => path.includes('fixtures/'))
    const collection = new Map()
    filePaths.forEach(filePath => {
      const fixtureName = filePath.replace(/.*fixtures\//, '').replace('.js', '')
      collection.set(fixtureName, new Fixture({ name: fixtureName, ...loadFile(filePath) }))
    })
    this.collection = collection
  }

  activateFixture (fixtureName) {
    if (!this.collection.has(fixtureName)) {
      this.logger.warn(`Unable to activate fixture ${fixtureName} - not found in collection`)
      return
    }
    this.active.add(fixtureName)
  }

  deactivateFixture (fixtureName) {
    this.active.delete(fixtureName)
  }

  update () {
    this.buildCollection()
    // Reconcile currently active fixtures.
    Array.from(this.active.keys()).forEach(activeFixture => {
      this.collection.has(activeFixture)
        ? this.activateFixture(activeFixture)
        : this.deactivateFixture(activeFixture)
    })
  }

  applyFixtures (req, payload) {
    if (this.active.size > 0) {
      return Array.from(this.active).reduce((response, activeFixture) => {
        const fixture = this.collection.get(activeFixture)
        response = fixture.execute(req, payload)
        return response
      }, payload)
    }
    return payload
  }
}

module.exports = Fixtures
