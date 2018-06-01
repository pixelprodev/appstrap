const path = require('path')

const rootPath = process.cwd()
module.exports = (modulePath, {useCache = true} = {}) => {
  if (!useCache) {
    delete require.cache[require.resolve(path.join(rootPath, modulePath))]
  }

  return require(path.join(rootPath, modulePath))
}
