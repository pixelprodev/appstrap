const path = require('path')
const fs = require('fs')
const mergeDeep = require('lodash.merge')
const decache = require('decache')

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
  constructor ({ directory }) {
    const presetsFolder = path.join(directory, 'presets')
    this.sequence = []
    this._collection = fs.existsSync(presetsFolder)
      ? this.load(presetsFolder)
      : []
    this.mapGroups = this.mapGroups.bind(this)
    this.activatePreset = this.activatePreset.bind(this)
    this.activatePresets = this.activatePresets.bind(this)
    this.deactivatePreset = this.deactivatePreset.bind(this)
    this.deactivatePresets = this.deactivatePresets.bind(this)
  }

  get activePresetMap () {
    const activeMap = new Map()
    if (this.sequence.length === 0) { return activeMap }
    return this.sequence
      .map(this.mapGroups)
      .reduce(this.combineGroups, activeMap)
  }

  get state () {
    return ({
      sequence: this.sequence,
      collection: this._collection
    })
  }

  mapGroups (groupName) {
    return this._collection.filter(preset => preset.group === groupName)
  }

  combineGroups (presetMap, groupCollection) {
    groupCollection.forEach(({ method, path, mode, data }) => {
      const mapKey = `${method}:::${path}`
      if (presetMap.has(mapKey)) {
        const existing = presetMap.get(mapKey)
        presetMap.set(mapKey, {
          mode,
          data: mode === 'replace' ? data : mode === 'mergeDeep'
            ? mergeDeep(existing.data, data)
            : { ...existing.data, ...data }
        })
      } else {
        presetMap.set(mapKey, { mode, data })
      }
    })
    return presetMap
  }

  load (folder) {
    if (!fs.existsSync(folder)) { return [] }
    const presetFiles = fs.readdirSync(folder)
    return presetFiles.map(fileName => {
      const group = fileName.replace('.js', '')
      const filePath = path.join(folder, fileName)
      try { decache(filePath) } catch (e) {}
      const collection = require(filePath)
      if (!Array.isArray(collection)) { return [] }
      return collection.reduce((acc, { path, mode, ...methods }) =>
        acc.concat(Object.keys(methods).map(method =>
          new Preset({ group, path, mode, method, data: methods[method] })
        ))
      , [])
    }).reduce((acc, group) => acc.concat(group))
  }

  activatePreset (presetName) { this.sequence.push(presetName) }
  activatePresets (collection) { collection.forEach(presetName => this.activatePreset(presetName)) }
  deactivatePreset (presetName) { return this.deactivatePresets([presetName]) }
  deactivatePresets (collection) {
    this.sequence = collection.reduce((acc, groupToRemove) =>
      acc.filter(sequenceEntry => sequenceEntry !== groupToRemove), this.sequence)
  }
}

module.exports = Presets
