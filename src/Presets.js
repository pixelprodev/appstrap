const path = require('path')
const fs = require('fs-extra')
const mergeDeep = require('lodash.merge')

class Preset {
  constructor ({ group, path, method, data, mode = 'replace' }) {
    this.key = `${method}:::${path}`
    this.group = group
    this.path = path
    this.method = method
    this.data = data
    this.mode = mode
  }
}

class Presets {
  constructor ({directory}) {
    const presetsFolder = path.join(directory, 'presets')
    this.sequence = []
    this._collection = fs.existsSync(presetsFolder)
      ? this.load(presetsFolder)
      : []
    this.mapGroups = this.mapGroups.bind(this)
  }

  get activePresetMap () {
    const activeMap = new Map()
    if (this.sequence.length === 0) { return activeMap }
    return this.sequence
      .map(this.mapGroups)
      .reduce(this.combineGroups, activeMap)
  }

  mapGroups (groupName) {
    return this._collection.filter(preset => preset.group === groupName)
  }

  combineGroups (presetMap, groupCollection) {
    groupCollection.forEach(({method, path, mode, data}) => {
      const mapKey = `${method}:::${path}`
      if (presetMap.has(mapKey)) {
        const existing = presetMap.get(mapKey)
        presetMap.set(mapKey, {
          mode,
          data: mode === 'replace' ? data : mode === 'mergeDeep'
            ? mergeDeep(existing.data, data)
            : {...existing.data, ...data}
        })
      } else {
        presetMap.set(mapKey, {mode, data})
      }
    })
    return presetMap
  }

  load (folder) {
    const presetFiles = fs.readdirSync(folder)
    return presetFiles.map(fileName => {
      const group = fileName.replace('.js', '')
      const collection = require(path.join(folder, fileName))
      return collection.reduce((acc, {path, mode, ...methods}) =>
        acc.concat(Object.keys(methods).map(method =>
          new Preset({ group, path, mode, method, data: methods[method] })
        ))
        , [])
    }).reduce((acc, group) => acc.concat(group))
  }

  activatePreset (presetName) { this.activatePresets([presetName]) }
  activatePresets (collection) { this.sequence.concat(collection) }
  deactivatePreset (presetName) { this.deactivatePresets([presetName]) }
  deactivatePresets (collection) {
    this.sequence = collection.reduce((acc, groupToRemove) =>
      acc.filter(sequenceEntry => sequenceEntry !== groupToRemove)
      , this.sequence)
  }
}

module.exports = Presets
