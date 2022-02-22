const routePrefix = '/__interactor'

class Interactor {
  constructor ({ handlers, fixtures }) {
    this.handlers = handlers
    this.fixtures = fixtures
    this.routeMap = [
      { path: `${routePrefix}/setHandlerEnabled`, method: 'POST', execute: this.setHandlerEnabled },
      { path: `${routePrefix}/setModifier`, method: 'POST', execute: this.setModifier },
      { path: `${routePrefix}/clearModifiers`, method: 'GET', execute: this.clearModifiers },
      { path: `${routePrefix}/getStatus`, method: 'GET', execute: this.getStatus },
      { path: `${routePrefix}/activateFixture`, method: 'POST', execute: this.activateFixture },
      { path: `${routePrefix}/activateFixtures`, method: 'POST', execute: this.activateFixtures },
      { path: `${routePrefix}/deactivateFixture`, method: 'POST', execute: this.deactivateFixture },
      { path: `${routePrefix}/injectState`, method: 'POST', execute: this.injectState },
      { path: `${routePrefix}/addResponseSequence`, method: 'POST', execute: this.addResponseSequence }
    ]
  }

  getStatus (context) {
    const fixtureGroups = Array.from(this.fixtures.collection.keys())
    const fixtures = fixtureGroups.map(fixture => ({ name: fixture, active: false }))
    Array.from(this.fixtures.activeFixtures.values()).forEach((activeFixtureName, indexOrder) => {
      const indexInGroup = fixtures.findIndex(fixture => fixture.name === activeFixtureName)
      fixtures[indexInGroup].active = true
      fixtures[indexInGroup].order = indexOrder + 1
    })
    const status = {
      fixtures,
      routes: Array.from(this.handlers.collection.values()),
      state: context.state
    }
    return context ? context.body === status : status
  }

  clearModifiers ({ path, method } = { path: '*', method: '*' }) {}

  setHandlerEnabled ({ path, method, enabled }, res) {
    const handler = this.handlers.pick(path, method)
    handler.disabled = !enabled
    if (res) { res.sendStatus(200) }
  }

  setModifier ({ path, method, ...args }, res) {
    const handler = this.handlers.pick(path, method)
    Object.keys(args).forEach(arg => {
      handler[arg] = args[arg]
    })
    if (res) { res.sendStatus(200) }
  }

  activateFixture (fixtureName, res) {
    const name = typeof fixtureName === 'string' ? fixtureName : fixtureName.name
    this.fixtures.activateFixture(name.toLowerCase())
    if (res) { res.sendStatus(200) }
  }

  activateFixtures (fixtureArray, res) {
    fixtureArray.forEach(fixtureName => this.activateFixture(fixtureName))
    if (res) { res.sendStatus(200) }
  }

  deactivateFixture (fixtureName, res) {
    const name = typeof fixtureName === 'string' ? fixtureName : fixtureName.name
    this.fixtures.deactivateFixture(name.toLowerCase())
    if (res) { res.sendStatus(200) }
  }

  injectState (update, res) {
    this.memoryStore.state = update
    if (res) { res.sendStatus(200) }
  }

  addResponseSequence (handlerList, res) {
    handlerList.forEach(({ path, method, responseSequence }) => {
      const handler = this.handlers.pick(path, method)
      handler.responseSequence = responseSequence
    })
    if (res) { res.sendStatus(200) }
  }
}

exports = module.exports = Interactor
