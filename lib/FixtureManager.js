const fs = require('fs')
const path = require('path')
const Fixture = require('./Fixture')

class FixtureManager {
  constructor ({ config, handlers }) {
    this.root = path.join(config.configPath, 'fixtures')
    this.handlers = handlers
    this.collection = new Map()
    this.load()
  }

  // at the moment - does not support subfolders
  load () {
    if (!fs.existsSync(this.root)) { return }
    const rootDir = fs.readdirSync(this.root)
    rootDir.forEach(file => {
      const fixtureName = file.replace('.js', '')
      const fixtureData = require(path.join(this.root, file))
      this.collection.set(fixtureName, new Fixture(fixtureData))
    })
  }

  activateFixture (fixtureName) {
    const fixture = this.collection.get(fixtureName)
    const handlerKeys = fixture.routes.keys()
    Array.from(handlerKeys).forEach(handlerKey => {
      const handler = this.handlers.pick(...handlerKey.split(':::'))
      handler.fixtures.set(fixtureName, fixture.routes.get(handlerKey))
    })
  }
}

exports = module.exports = FixtureManager
