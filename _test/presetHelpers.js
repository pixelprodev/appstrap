import fs from 'fs-extra'
import path from 'path'

export function getPresets () {
  const presetFiles = fs.readdirSync(path.resolve(`${__dirname}/_testConfig/presets`))
  const presets = {}
  presetFiles.forEach(fileName => {
    presets[fileName.replace('.js', '')] = require(`${__dirname}/_testConfig/presets/${fileName}`)
  })
  return presets
}

export function getPresetData (presetName) {
  const presetFiles = getPresets()
  return presetFiles[presetName].find(({path}) => path === '/').get
}
