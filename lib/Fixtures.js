const Fixture = require('./Fixture')
const { loadFile } = require('./_helpers')

class Fixtures {
  constructor ({ config, handlers, logger }) {
    this.config = config
    this.handlers = handlers
    this.logger = logger
    this.active = new Map()
    this.buildCollection()
  }

  buildCollection () {
    const filePaths = this.config.files.filter(path => path.includes('fixtures/'))
    const collection = new Map()
    filePaths.forEach(filePath => {
      const fixtureName = filePath.replace(/.*fixtures\//, '').replace('.js', '')
      collection.set(fixtureName, loadFile(filePath))
    })
    this.collection = collection
  }

  activateFixture (fixtureName) {
    if (!this.collection.has(fixtureName)) {
      this.logger.warn(`Unable to activate fixture ${fixtureName} - not found in collection`)
      return
    }

    const fixture = this.collection.get(fixtureName)
    if (fixture.routes) {
      const mappedHandlers = []
      fixture.routes.map(({ path, mode = 'merge', ...methods }) => {
        Object.keys(methods).forEach(method => {
          const handlerId = `${path}:::${method.toUpperCase()}`

          if (!this.handlers.collection.has(handlerId)) {
            console.warn('fixture contains route information that does not match any defined handlers')
          } else {
            const handler = this.handlers.collection.get(handlerId)
            handler.fixtures.set(fixtureName, new Fixture({ mode, data: methods[method] }))
            mappedHandlers.push(handlerId)
          }
        })
      })
      this.active.set(fixtureName, mappedHandlers)
    }
  }

  deactivateFixture (fixtureName) {
    const assignedHandlers = this.active.get(fixtureName)
    assignedHandlers.forEach(handler => {
      const selectedHandler = this.handlers.collection.get(handler)
      selectedHandler.fixtures.delete(fixtureName)
    })
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
}

module.exports = Fixtures
