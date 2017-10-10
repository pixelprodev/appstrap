const initialState = {
  appName: '',
  appVersion: '',
  presets: [],
  routes: []
}
function reducer (state = initialState, action) {
  switch(action.type) {
    case 'SET_APP_DATA':
      return { state, appName: action.appName, appVersion: action.appVersion, presets: action.presets, routes: action.routes}

    default:
      return state
  }
}

export default reducer
