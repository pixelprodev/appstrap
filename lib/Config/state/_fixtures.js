const { ACTIVATE_FIXTURE, DEACTIVATE_FIXTURE, ENTITY_ADD, ENTITY_CHANGE, ENTITY_UNLINK } = require('../constants')
const Fixture = require('../../Fixture')
module.exports = function fixturesReducer (state = { active: new Set(), collection: [] }, action) {
  if (action.type === ENTITY_ADD && action.entity instanceof Fixture) {
    return { ...state, collection: [...state.collection, action.entity] }
  }

  if (action.type === ENTITY_CHANGE && action.entity instanceof Fixture) {
    const indexToUpdate = state.collection.findIndex(f => f.name === action.entity.name)
    state.collection[indexToUpdate] = action.entity
  }

  if (action.type === ENTITY_UNLINK && action.filePath.includes('fixtures')) {
    const fixtureRemovedName = Fixture.getNameFromPath(action.filePath)
    const active = new Set(state.active)
    active.delete(fixtureRemovedName)
    return { active, collection: state.collection.filter(f => f.name !== fixtureRemovedName) }
  }

  if (action.type === ACTIVATE_FIXTURE) {
    const active = new Set(state.active)
    active.add(action.name)
    return ({ ...state, active })
  }
  if (action.type === DEACTIVATE_FIXTURE) {
    const updater = new Set(state.active)
    updater.delete(action.name)
    return ({ ...state, active: updater })
  }
  return state
}
