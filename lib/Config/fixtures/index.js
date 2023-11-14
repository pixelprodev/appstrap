const Fixture = require('./Fixture')
const { loadFile } = require('../../_helpers')
const { validateFixture } = require('../validators')

class Fixtures {
  constructor ({ files, events }) {
    this.files = files
    this.collection = new Map()
    this.active = new Set()
    this.events = events

    const fixturePaths = this.files.filter(file => file.includes('/fixtures/'))
    fixturePaths.forEach(fixturePath => {
      const fixtureName = fixturePath.replace(/.*fixtures\//, '').replace('.js', '')
      this.collection.set(fixtureName, new Fixture({ name: fixtureName, ...loadFile(fixturePath, validateFixture, events) }))
    })
  }

  activateFixture (fixtureName) {
    if (!this.collection.has(fixtureName)) {
      this.events.emit('log', { level: 'warn', message: `Unable to activate fixture ${fixtureName} - not found in collection` })
      return
    }
    this.active.add(fixtureName)
  }

  deactivateFixture (fixtureName) {
    this.active.delete(fixtureName)
  }

  applyActive ({ req }, payload) {
    return this.active.size > 0
      ? Array.from(this.active)
        .reduce((response, activeFixture) =>
          this.collection.get(activeFixture).execute(req, payload)
        , payload)
      : payload
  }
}

module.exports = Fixtures
