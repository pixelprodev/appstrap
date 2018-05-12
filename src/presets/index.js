import path from 'path'
import Config from '../config/loader'
import fs from 'fs-extra'
import { ErrPresetNotFound } from '../errors'
import Preset from './Preset'

export class Presets {
  constructor () {
    this._presets = []
    this.loadPreset = this.loadPreset.bind(this)
    this.loadPresets = this.loadPresets.bind(this)
  }

  clear () {
    this._presets = []
  }

  fetch ({path, method}) {
    const presetIndex = this._presets.findIndex(preset => preset.method === method && preset.path === path)
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

  _getPresetFileData ({ filePath, fileData = require(path.resolve(filePath)) }) {
    const presets = []
    fileData.forEach(({path, mode, ...methods}) => {
      Object.keys(methods).forEach(method => {
        presets.push(new Preset({ path, mode, method, data: methods[method] }))
      })
    })
    return presets
  }

  async loadPreset (presetName) {
    const presets = await this.validateAndLoadPresetFile(presetName)
    this.addPresetsToInternalCollection(presets)
  }

  async loadPresets (presetNames) {
    const presetDataCollection = presetNames.map(async (name) => {
      await this.validateAndLoadPresetFile(name)
    })

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
    return this._getPresetFileData({filePath})
  }

  combinePresets (presetDataCollection) {
    return presetDataCollection.reduce((acc, presetFile) => {
      presetFile.forEach(preset => {
        let existingIndex = acc.findIndex(row => row.path === preset.path && row.method === preset.method)
        if (existingIndex > -1) {
          acc[existingIndex].data = preset.mode === 'merge'
            ? {...acc[existingIndex].data, ...preset.data}
            : {...preset.data}
        } else {
          acc.push(preset)
        }
      })
      return acc
    }, [])
  }
}

const singleton = new Presets()
export default singleton
