const path = require('path')
const fs = require('fs')
const mergeDeep = require('lodash.merge')
const decache = require('decache')

class Preset {
  constructor ({ group, path, method, data, mode = 'replace' }) {
    this.key = `${method.toLowerCase()}:::${path.toLowerCase()}`
    this.group = group.toLowerCase()
    this.path = path
    this.method = method
    this.data = data
    this.mode = mode
  }
}

class Presets {
  constructor ({ directory }) {
    const presetsFolder = path.join(directory, 'presets')
    this.groups = new Set()
    this.activeGroups = new Set()
    this.collection = fs.existsSync(presetsFolder)
      ? this.load(presetsFolder)
      : []

    this.applyPresets = this.applyPresets.bind(this)
    this.activatePreset = this.activatePreset.bind(this)
    this.activatePresets = this.activatePresets.bind(this)
    this.deactivatePreset = this.deactivatePreset.bind(this)
    this.deactivatePresets = this.deactivatePresets.bind(this)
  }

  get state () {
    return ({
      sequence: Array.from(this.activeGroups),
      collection: this.collection
    })
  }

  load (folder) {
    if (!fs.existsSync(folder)) { return [] }
    const presetFiles = fs.readdirSync(folder)
    return presetFiles.map(fileName => {
      const group = fileName.replace('.js', '')
      this.groups.add(group.toLowerCase())
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

  applyPresets (req, data) {
    const key = `${req.method.toLowerCase()}:::${req.path.toLowerCase()}`
    Array.from(this.activeGroups).forEach(groupName => {
      this.collection.forEach(preset => console.log(preset.key))
      const matchingPreset = this.collection.find(preset => (preset.group === groupName && preset.key === key))
      if (matchingPreset) {
        data = matchingPreset.mode === 'replace'
          ? matchingPreset.data
          : matchingPreset.mode === 'mergeDeep'
            ? mergeDeep(data, matchingPreset.data)
            : { ...data, ...matchingPreset.data }
      }
    })
    return data
  }

  activatePreset (presetName) { this.activeGroups.add(presetName) }
  activatePresets (collection) { collection.forEach(presetName => this.activatePreset(presetName)) }
  deactivatePreset (presetName) { this.activeGroups.delete(presetName) }
  deactivatePresets (collection) { collection.forEach(presetName => this.deactivatePreset(presetName)) }
}

module.exports = Presets
