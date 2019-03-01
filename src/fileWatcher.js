const chokidar = require('chokidar')
const decache = require('decache')
const path = require('path')

module.exports = function fileWatcher ({ config, server }) {
  let modulePaths = getModules()
  chokidar.watch(modulePaths)
    .on('all', (event, filePath) => { reloadModule(filePath) })

  function getModules () {
    return Object.keys(require.cache)
      .filter((path) => !path.includes('node_modules') && path.startsWith(process.cwd()))
  }

  function reloadModule (filePath) {
    decache(filePath)
    if (filePath.includes(config.directory)) {
      config.load({ directory: config.directory })
      config.endpoints.load({ data: config.data })
      const presetDirectory = path.join(config.directory, 'presets')
      config.presets._collection = config.presets.load(presetDirectory)
      server.configure({ config })
      if (config.data.initialState) {
        server.memoryState.state = config.data.initialState
      }
    }
  }
}
