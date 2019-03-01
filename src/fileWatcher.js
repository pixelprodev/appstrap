const chokidar = require('chokidar')
const decache = require('decache')
const path = require('path')

module.exports = function fileWatcher ({ config, server }) {
  let modulePaths = getModules()
  const watcher = chokidar.watch(modulePaths, {ignoreInitial: true})
    .on('all', (event, filePath) => {
      reloadModule(filePath)
      updateWatcher()
    })

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

  function updateWatcher () {
    const watched = watcher.getWatched()
    const currentlyWatchedModules = [].concat(...Object.keys(watched).map(module => {
      return watched[module].map(fileName => path.join(module, fileName))
    }))

    const allModules = getModules()
    const pathsToAdd = allModules.filter(modulePath => !currentlyWatchedModules.includes(modulePath))
    if (pathsToAdd.length > 0) {
      watcher.add(pathsToAdd)
    }
  }
}
