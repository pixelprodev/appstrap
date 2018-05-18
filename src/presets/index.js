import path from 'path'
import Config from '../config/loader'
import fs from 'fs-extra'
import { ErrPresetNotFound } from '../errors'
import { locateProjectRoot } from '../utilities'
import Preset from './Preset'

export class Presets {
  constructor () {
    this._presets = []
    this._availablePresets = []
    this._activePresetGroups = []
    this.loadPreset = this.loadPreset.bind(this)
    this.loadPresets = this.loadPresets.bind(this)
  }

  clear () {
    this._presets = []
    this._activePresetGroups = []
  }

  fetch ({path, method}) {
    const presetIndex = this._presets.findIndex(preset => preset.method === method.toLowerCase() && preset.path === path.toLowerCase())
    return presetIndex === -1 ? presetIndex : this._presets[presetIndex]
  }

  _ensureFileExists (configFilePath) {
    if (!fs.existsSync(configFilePath)) {
      throw new ErrPresetNotFound()
    }
  }

  _buildFilePath (fileName, configDirectory = Config.configDirectory) {
    return `${configDirectory}/presets/${fileName}.js`
  }

  _getPresetFileData ({ filePath, fileData = require(path.resolve(filePath)), name }) {
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
    const presetDataCollection = await Promise.all(presetNames.map(async (name) => this.validateAndLoadPresetFile(name)))
    const presets = this.combinePresets(presetDataCollection)
    this.addPresetsToInternalCollection(presets)
  }

  addPresetsToInternalCollection (presets) {
    presets.forEach(preset => {
      let indexToOverwrite = this._presets.findIndex(row => row.path === preset.path && row.method === preset.method)
      indexToOverwrite === -1 ? this._presets.push(preset) : this._presets[indexToOverwrite] = preset
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

  preloadPresets (configDirectory = Config.configDirectory) {
    const projectRoot = locateProjectRoot()
    const presetFiles = fs.readdirSync(path.resolve(`${configDirectory}/presets`))
    let presets = []
    presetFiles.forEach(fileName => {
      const name = fileName.replace('.js', '')
      const fileData = require(path.resolve(`${projectRoot}/${configDirectory}/presets/${fileName}`))
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

const singleton = new Presets()
export default singleton
