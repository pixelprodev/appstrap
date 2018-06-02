const path = require('path')
const decache = require('decache')

const rootPath = process.cwd()
module.exports = (modulePath, {useCache = true} = {}) => {
  if (!useCache) {
    decache(modulePath)
  }

  return require(path.join(rootPath, modulePath))
}
