const { CONFIG_LOAD, ACTIVATE_FIXTURE, DEACTIVATE_FIXTURE, CONFIG_RELOAD } = require('../constants')
module.exports = function fixturesReducer (state = { active: new Set(), collection: [] }, action) {
  if (action.type === CONFIG_LOAD || action.type === CONFIG_RELOAD) {
    return { ...state, collection: action.fixtures }
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
