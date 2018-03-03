const AppConfig = require('./AppConfig')
const { createStore } = require('redux')

function getDefaultModifiers (routes) {
  let modifiers = []
  const defaults = {latency: false, latencyMS: 0, error: false}
  routes.forEach(route => {
    let thisRouteModifier = {endpoint: route.endpoint};
    ['GET', 'POST', 'PUT', 'DELETE'].forEach(method => {
      if (route[method]) {
        thisRouteModifier[method] = defaults
      }
    })
    modifiers.push(thisRouteModifier)
  })
  return modifiers
}

function reducer (state = {modifiers: [], routeData: {}, config: {}}, {type, ...args}) {
  switch (type) {
    case 'LOAD_CONFIG':
      let config = new AppConfig(args)
      return {...state, config}

    case 'OVERRIDE_CONFIG_PORT':
      return {...state, config: {...state.config, port: args.port}}

    case 'SET_DEFAULTS':
      return { ...state, modifiers: getDefaultModifiers(state.config.routes), routeData: {} }

    case 'LOAD_INITIAL_STATE':
    case 'SET_ROUTE_DATA':
      return { ...state, routeData: args.routeData }

    case 'SET_MODIFIER_DATA':
      let modifiers = state.modifiers.slice(0)
      let modIndex = modifiers.findIndex(m => m.endpoint === args.endpoint)
      modifiers[modIndex][args.method] = {...modifiers[modIndex][args.method], ...args.data}
      return { ...state, modifiers }

    default:
      return state
  }
}

module.exports = createStore(reducer)
