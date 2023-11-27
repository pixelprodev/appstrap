const {
  ERROR,
  ERR_NO_REPOSITORY_DEFINED,
  ERR_NO_REPOSITORY_FOUND,
  ERR_REPOSITORY_EMPTY,
  RESOLVE_REPOSITORY,
  CONFIG_LOAD, CONFIG_RELOAD, INFO
} = require('./constants')
const state = require('./state')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const { loadFile } = require('../_helpers')
const { validateFixture, validateEndpoint, validateGqlOperation } = require('./validators')
const { match } = require('path-to-regexp')

class Config {
  constructor ({ watch = false, repository, gqlEndpoint }) {
    this.state = state.configure({ config: { watch, repository, gqlEndpoint } })
  }

  async load () {
    const { config } = this.state.getState()
    const repository = this.resolveRepository(config.repository)
    if (repository) {
      const fileList = glob.sync(`${repository}/**/*`, { nodir: true, nosort: true })
      const files = fileList.filter(filePath => !filePath.includes('.gitkeep'))
      if (files.length === 0) {
        this.state.dispatch({ type: ERROR, msg: ERR_REPOSITORY_EMPTY })
      } else {
        const dispatch = this.state.dispatch
        const metadata = { fileList: files }

        const initialStateFile = files.find(file => file === `${repository}/initialState.js`)
        metadata.state = initialStateFile ? loadFile(initialStateFile) : {}

        const hostMap = files.find(file => file === `${repository}/hostMap.js`)
        metadata.hostMap = hostMap ? loadFile(hostMap) : {}

        const fixtureFiles = files.filter(file => file.includes('/fixtures/'))
        metadata.fixtures = []
        fixtureFiles.forEach(file => {
          const fileData = loadFile(file, validateFixture, dispatch)
          if (fileData) {
            metadata.fixtures.push({ name: file.replace(/.*fixtures\//, '').replace('.js', ''), ...fileData })
          }
        })

        const restEndpointFiles = files.filter(file => file.includes('/routes/'))
        metadata.endpoints = []
        restEndpointFiles.forEach(file => {
          const path = file.replace(/.*routes\//, '/').replace(/\[(.*?)\]/g, ':$1').replace('.js', '')
          const requestForwardingPath = Object.keys(metadata.hostMap).find(pathKey => {
            if (pathKey === '*') { return true }
            const matcher = new RegExp(pathKey)
            return matcher.test(path)
          })
          const fileData = loadFile(file, validateEndpoint, dispatch)
          if (fileData) {
            Object.keys(fileData).forEach(method => {
              metadata.endpoints.push({
                isGql: false,
                path,
                method,
                matcher: match(path, { decode: decodeURIComponent }),
                handler: fileData[method],
                requestForwardingEnabled: !!requestForwardingPath,
                requestForwardingDestination: metadata.hostMap[requestForwardingPath] || ''
              })
            })
          }
        })
        if (config.gqlEndpoint) {
          const requestForwardingPath = Object.keys(metadata.hostMap).find(pathKey => {
            if (pathKey === '*') { return true }
            const matcher = new RegExp(pathKey)
            return matcher.test(config.gqlEndpoint)
          })
          metadata.endpoints.push({
            isGql: true,
            path: config.gqlEndpoint,
            method: 'POST',
            matcher: match(config.gqlEndpoint, { decode: decodeURIComponent }),
            handler: () => {}, // TODO match operationName and pull handler from it
            requestForwardingEnabled: !!requestForwardingPath,
            requestForwardingDestination: metadata.hostMap[requestForwardingPath] || ''
          })
        }

        metadata.gqlOperations = []
        const gqlOperationFiles = files.filter(file => file.includes('/gql/'))
        gqlOperationFiles.forEach(file => {
          const operationName = file.replace(/.*gql\//, '').replace('.js', '')
          const handler = loadFile(file, validateGqlOperation, dispatch)
          if (handler) {
            metadata.gqlOperations.push({ operationName, handler })
          }
        })

        this.state.dispatch({ type: CONFIG_LOAD, ...metadata })
      }
    }
  }

  async update (...event) {
    console.log(event)
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
