import { createSelector as selActivePresets } from 'reselect'

export default selActivePresets(
  store => store.activeGroups,
  (activeGroups) => activeGroups.map(name => ({ name, isActive: true })).reverse()
)
