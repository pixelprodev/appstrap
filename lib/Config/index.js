const path = require('path')
const fs = require('fs')
const glob = require('glob')
const { ERR_NO_REPOSITORY_DEFINED, ERR_NO_REPOSITORY_FOUND, ERR_REPOSITORY_EMPTY } = require('../_errors')
const Fixtures = require('./fixtures')
const Routes = require('./Routes')
const { loadFile } = require('../_helpers')

class Config {
  constructor ({ repository, watchEnabled = false, gqlEndpoint, events }) {
    this.watchEnabled = watchEnabled
    this.gqlEndpoint = gqlEndpoint
    this.repository = this.resolveRepository(repository)
    const files = glob.sync(`${this.repository}/**/*`, { nodir: true, nosort: true })
    this.files = files.filter(filePath => !filePath.includes('.gitkeep'))
    if (this.files.length === 0) { throw new Error(ERR_REPOSITORY_EMPTY) }

    const initialStateFile = this.files.find(file => file === `${this.repository}/initialState.js`)
    this.state = initialStateFile ? loadFile(initialStateFile) : {}

    const proxyMap = this.files.find(file => file === `${this.repository}/proxy.js`)
    this.proxyMap = proxyMap ? loadFile(proxyMap) : {}

    this.fixtures = new Fixtures({ files: this.files, events })
    this.routes = new Routes({ files: this.files, events, gqlEndpoint, applyFixtures: this.fixtures.applyFixtures.bind(this.fixtures) })
  }

  normalizeFilePath (filePath) {
    // remove separator prefix
    if (path.isAbsolute(filePath)) { filePath = filePath.substring(1) }

    // convert to web url separators ( / ) regardless of OS
    return filePath.split(path.sep)
      .filter(entry => !!entry) // remove double slashes before re-joining with posix separator
      .join(path.posix.sep)
  }

  /*
  * This method lays the groundwork for supporting remote repositories in the future.  For now there will be no additional
  * logic around resolving the repository other than on the local filesystem, but this resolver can be expanded to look
  * for http urls, git urls, and potentially other sources in the future.
  * */
  resolveRepository (repository) {
    if (!repository) {
      throw new Error(ERR_NO_REPOSITORY_DEFINED)
    }
    const directory = path.resolve(this.normalizeFilePath(repository))
    if (!fs.existsSync(directory)) {
      throw new Error(ERR_NO_REPOSITORY_FOUND(repository))
    }
    return directory
  }
}

module.exports = exports = Config
