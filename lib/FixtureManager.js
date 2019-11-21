const fs = require('fs')
const path = require('path')
const Fixture = require('./Fixture')
const Joi = require('@hapi/joi')

class FixtureManager {
  constructor ({ config, handlers, logger, memoryStore }) {
    this.root = path.join(config.configPath, 'fixtures')
    this.handlers = handlers
    this.memoryStore = memoryStore
    this.logger = logger
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
      if (this.validateFixture(fixtureName, fixtureData)) {
        this.collection.set(fixtureName, new Fixture(fixtureData))
      }
    })
  }

  validateFixture (fixtureName, fixtureData) {
    const fixtureSchema = Joi.object({ injectState: Joi.function(), routes: Joi.array() }).max(1)
    const { error } = fixtureSchema.validate(fixtureData)
    if (error) { return this.logger.info(`Unable to load fixture ${fixtureName}. ${error}`) }
    return true
  }

  activateFixture (fixtureName) {
    const fixture = this.collection.get(fixtureName)
    if (fixture.injectState) { this.memoryStore.state = fixture.injectState(this.memoryStore.state) }
    const handlerKeys = fixture.routes.keys()
    Array.from(handlerKeys).forEach(handlerKey => {
      const handler = this.handlers.pick(...handlerKey.split(':::'))
      handler.fixtures.set(fixtureName, fixture.routes.get(handlerKey))
    })
  }
}

exports = module.exports = FixtureManager
