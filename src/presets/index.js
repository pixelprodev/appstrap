import path from 'path'
import Config from '../config/loader'
import fs from 'fs-extra'
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
      // TODO throw error here
    }
  }

  _ensureFileIntegrity () {
    // TODO figure out validations and perform
  }

  _buildFilePath (fileName) {
    return `${Config.configDirectory}/presets/${fileName}.js`
  }

  _getPresetFileData ({ filePath, presets = require(path.resolve(filePath)) }) {
    this._ensureFileIntegrity(presets)
    return presets
  }

  async loadPreset (presetName) {
    let filePath = this._buildFilePath(presetName)
    await this._ensureFileExists(filePath)

    const presets = this._getPresetFileData({filePath})
    presets.forEach(preset => {
      let indexToOverwrite = this._presets.findIndex(row => row.path === preset.path && row.method === preset.method)
      indexToOverwrite === -1
        ? this._presets.push(new Preset(preset))
        : this._presets[indexToOverwrite] = new Preset(preset)
    })
  }

  async loadPresets (presetNames) {

  }
}

const singleton = new Presets()
export default singleton
