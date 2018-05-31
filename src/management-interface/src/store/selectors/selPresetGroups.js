import { createSelector as selPresetGroups } from 'reselect'

export default selPresetGroups(
  state => state.activePresets,
  state => state.availablePresets,
  (activePresets, availablePresets) => {
    const presetGroups = new Set()
    activePresets.forEach(activePreset => {
      presetGroups.add(activePreset.name)
    })
    availablePresets.forEach(availablePreset => {
      presetGroups.add(availablePreset.name)
    })
    return Array.from(presetGroups)
  }
)
