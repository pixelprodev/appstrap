const chokidar = require('chokidar')
const decache = require('decache')
const path = require('path')

function initialize ({ config, server }) {
  chokidar.watch(config.directory, { ignoreInitial: true }).on('all', () => {
    try {
      decache(path.join(config.directory, 'config.js'))
      config.load({ directory: config.directory })
      config.endpoints.load({ data: config.data })
      const presetDirectory = path.join(config.directory, 'presets')
      config.presets._collection = config.presets.load(presetDirectory)
      server.configure({ config })
      if (config.data.initialState) {
        server.memoryState.state = config.data.initialState
      }
    } catch (e) {} // swallow error for now until we can add more checks
  })
}

module.exports = {
  initialize
}
