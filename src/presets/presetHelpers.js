import fs from 'fs-extra'
import path from 'path'
import { locateProjectRoot } from '../utilities'

export function getPresets () {
  const projectRoot = locateProjectRoot()
  const presetFiles = fs.readdirSync(path.join(projectRoot, '_test', '_testConfig', 'presets'))
  const presets = {}
  presetFiles.forEach(fileName => {
    const fullPath = path.join(projectRoot, '_test', '_testConfig', 'presets', fileName)
    presets[fileName.replace('.js', '')] = require(fullPath)
  })
  return presets
}

export function getPresetData (presetName) {
  const presetFiles = getPresets()
  return presetFiles[presetName].find(({path}) => path === '/').get
}
