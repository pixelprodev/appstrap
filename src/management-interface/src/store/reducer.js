const initialState = {
  initialized: false, name: '', version: '', endpoints: [], availablePresetListFilter: '', activeGroups: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INITIALIZE_COMPLETE':
      return {...state,
        initialized: true,
        name: action.metadata.name,
        version: action.metadata.version,
        endpoints: action.endpoints,
        availablePresets: action.presets.availablePresets,
        activePresets: action.presets.activePresets,
        activeGroups: action.presets.activeGroups
      }

    case 'UPDATE_ENDPOINTS':
      return {...state, endpoints: action.endpoints}

    case 'UPDATE_PRESETS':
      return {
        ...state,
        availablePresets: action.availablePresets,
        activePresets: action.activePresets,
        activeGroups: action.activeGroups
      }

    case 'SET_AVAILABLE_PRESET_FILTER':
      return {
        ...state,
        availablePresetListFilter: action.value
      }

    default: return state
  }
}

export default reducer
