import { createSelector as selNonActivePresets } from 'reselect'
import selPresetGroups from './selPresetGroups'

export default selNonActivePresets(
  store => store.activeGroups,
  selPresetGroups,
  store => store.availablePresetListFilter,
  (activeGroups, presetGroups, listFilter) => {
    let groups = presetGroups.filter(groupName => !activeGroups.includes(groupName))
    if (listFilter.length > 0) {
      const matchExp = new RegExp(RegExp.escape(listFilter), 'i')
      groups = groups.filter(groupName => matchExp.test(groupName))
    }
    return groups.map(group => ({ name: group, isActive: false }))
  }
)
