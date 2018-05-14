import fs from 'fs-extra'
import path from 'path'

async function getPresets () {
  const presetFiles = await fs.readdir(path.resolve(`${__dirname}/_testConfig/presets`))
  const presets = {}
  presetFiles.forEach(fileName => {
    presets[fileName.replace('.js', '')] = require(`${__dirname}/_testConfig/presets/${fileName}`)
  })
  return presets
}

export default getPresets
