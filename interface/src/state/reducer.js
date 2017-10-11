const initialState = {
  appName: '',
  appVersion: '',
  presets: [],
  activePreset: null,
  routes: [],
  activeRoute: null
}
function reducer (state = initialState, action) {
  switch(action.type) {
    case 'SET_APP_DATA':
      return { ...state, appName: action.appName, appVersion: action.appVersion, presets: action.presets, routes: action.routes}

    case 'SET_ACTIVE_ROUTE':
      return {...state, activeRoute: action.activeRoute}

    default:
      return state
  }
}

export default reducer
