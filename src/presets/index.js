const path = require('path')
const fs = require('fs-extra')
const { ErrPresetNotFound } = require('../errors')
const Preset = require('./Preset')

class Presets {
  constructor ({ configDir, invokedFromCLI }) {
    this.presetFolder = path.join(configDir, 'presets')
    this._presets = []
    this._availablePresets = []
    this._activePresetGroups = []
    this.loadPreset = this.loadPreset.bind(this)
    this.loadPresets = this.loadPresets.bind(this)

    // When invoking from cli, the management interface is also
    //  initialized. That interface requires presets to be defined
    //  before it can load.
    if (invokedFromCLI) { this.preloadPresets() }
  }

  update () {
    this.preloadPresets()
    this.groupPresetsAndSetInternal()
  }

  clear () {
    this._presets = []
    this._activePresetGroups = []
  }

  fetch ({ path, method } = {}) {
    const presetIndex = this._presets.findIndex(preset => preset.method === method.toLowerCase() && preset.path === path.toLowerCase())
    return presetIndex === -1 ? presetIndex : this._presets[presetIndex]
  }

  _ensureFileExists (configFilePath) {
    if (!fs.existsSync(configFilePath)) {
      throw new ErrPresetNotFound()
    }
  }

  _buildFilePath (fileName) {
    return path.join(this.presetFolder, `${fileName}.js`)
  }

  _getPresetFileData ({ filePath, fileData = require(filePath, {useCache: false}), name }) {
    const presets = []
    fileData.forEach(({path, mode, ...methods}) => {
      Object.keys(methods).forEach(method => {
        presets.push(new Preset({ name, path, mode, method, data: methods[method] }))
      })
    })
    return presets
  }

  async loadPreset (presetName) {
    const presets = await this.validateAndLoadPresetFile(presetName)
    this.addPresetsToInternalCollection(presets)
  }

  async loadPresets (presetNames) {
    const presetDataCollection = await Promise.all(
      presetNames.map(async (name) =>
        this.validateAndLoadPresetFile(name)
      )
    )
    const presets = this.combinePresets(presetDataCollection)
    this.addPresetsToInternalCollection(presets)
  }

  /*
  Takes an array of Preset objects and adds them to the internal collection.  If a preset already
    exists in the internal collection for the path / method combo, it is overwritten.
  */
  addPresetsToInternalCollection (presets) {
    presets.forEach(preset => {
      let indexToOverwrite = this._presets.findIndex(row =>
        (row.path === preset.path) &&
        (row.method === preset.method)
      )
      indexToOverwrite === -1
        ? this._presets.push(preset)
        : this._presets[indexToOverwrite] = preset
    })
  }

  async validateAndLoadPresetFile (presetName) {
    let filePath = this._buildFilePath(presetName)
    await this._ensureFileExists(filePath)
    return this._getPresetFileData({filePath, name: presetName})
  }

  combinePresets (presetDataCollection) {
    return presetDataCollection.reduce((acc, presetFile) => {
      presetFile.forEach(preset => {
        let existingIndex = acc.findIndex(row => row.path === preset.path && row.method === preset.method)
        if (existingIndex > -1) {
          preset.mode === 'replace'
            ? acc[existingIndex] = preset
            : acc[existingIndex].data = {...acc[existingIndex].data, ...preset.data}
        } else {
          acc.push(preset)
        }
      })
      return acc
    }, [])
  }

  preloadPresets () {
    const presetFiles = fs.readdirSync(this.presetFolder)
    let presets = []
    presetFiles.forEach(fileName => {
      const name = fileName.replace('.js', '')
      const fileData = require(path.join(this.presetFolder, fileName), {useCache: false})
      presets = [...presets, ...this._getPresetFileData({fileData, name})]
    })
    this._availablePresets = presets
  }

  getStatus () {
    return {
      activePresets: this._presets,
      availablePresets: this._availablePresets,
      activeGroups: this._activePresetGroups
    }
  }

  activatePresetGroup ({name}) {
    this._activePresetGroups.push(name)
    this.groupPresetsAndSetInternal()
  }

  deactivatePresetGroup ({name}) {
    this._activePresetGroups = this._activePresetGroups.filter(activeName => activeName !== name)
    this.groupPresetsAndSetInternal()
  }

  groupPresetsAndSetInternal () {
    const presetsToGroup = this._activePresetGroups.map(groupName => {
      const matches = []
      this._availablePresets.forEach(row => {
        if (row.name === groupName) {
          matches.push(new Preset({...row}))
        }
      })
      return matches
    })
    this._presets = this.combinePresets(presetsToGroup)
  }
}

module.exports = Presets
