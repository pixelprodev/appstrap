import fs from 'fs-extra'
import path from 'path'

export function getPresets () {
  const presetFiles = fs.readdirSync(path.join(__dirname, '_testConfig', 'presets'))
  const presets = {}
  presetFiles.forEach(fileName => {
    const fullPath = path.join(__dirname, '_testConfig', 'presets', fileName)
    presets[fileName.replace('.js', '')] = require(fullPath)
  })
  return presets
}

export function getPresetData (presetName) {
  const presetFiles = getPresets()
  return presetFiles[presetName].find(({path}) => path === '/').get
}
