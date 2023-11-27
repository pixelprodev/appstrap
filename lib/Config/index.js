const {
  ERROR,
  ERR_NO_REPOSITORY_DEFINED,
  ERR_NO_REPOSITORY_FOUND,
  ERR_REPOSITORY_EMPTY,
  RESOLVE_REPOSITORY,
  CONFIG_LOAD, FILE_ADD, INIT_GQL, INIT_STATE, INIT_HOSTMAP
} = require('./constants')
const state = require('./state')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const { loadFile } = require('../_helpers')

class Config {
  constructor ({ repository, gqlEndpoint }) {
    this.state = state.configure()
    this.dispatch = this.state.dispatch
    const resolvedRepository = this.resolveRepository(repository)
    if (resolvedRepository) {
      const fileList = glob.sync(`${repository}/**/*`, { nodir: true, nosort: true })
      const files = fileList.filter(filePath => !filePath.includes('.gitkeep'))
      if (files.length === 0) {
        this.dispatch({ type: ERROR, msg: ERR_REPOSITORY_EMPTY })
      } else {
        const initialStateFile = files.find(file => file === `${repository}/initialState.js`)
        if (initialStateFile) {
          this.dispatch({ type: INIT_STATE, state: loadFile(initialStateFile) })
        }

        const hostMap = files.find(file => file === `${repository}/hostMap.js`)
        if (hostMap) {
          this.dispatch({ type: INIT_HOSTMAP, hostMap: loadFile(hostMap) })
        }

        if (gqlEndpoint) {
          this.dispatch({ type: INIT_GQL, gqlEndpoint })
        }

        files
          .filter(file => !file.endsWith('hostMap.js') && !file.endsWith('initialState.js'))
          .forEach(filePath => {
            this.dispatch({ type: FILE_ADD, filePath })
          })
      }
    }
  }

  normalizeFilePath (filePath) {
    // remove separator prefix
    if (path.isAbsolute(filePath)) { filePath = filePath.substring(1) }

    // convert to web url separators ( / ) regardless of OS
    return filePath.split(path.sep)
      .filter(entry => !!entry) // remove double slashes before re-joining with posix separator
      .join(path.posix.sep)
  }

  resolveRepository (repository) {
    if (!repository) {
      this.state.dispatch({ type: ERROR, msg: ERR_NO_REPOSITORY_DEFINED })
    }
    const directory = path.resolve(this.normalizeFilePath(repository))
    if (!fs.existsSync(directory)) {
      this.state.dispatch({ type: ERROR, msg: ERR_NO_REPOSITORY_FOUND, repository })
    }
    this.state.dispatch({ type: RESOLVE_REPOSITORY, location: directory })
    return directory
  }
}

module.exports = exports = Config
