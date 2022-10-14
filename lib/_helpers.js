const decache = require('decache')

exports = module.exports = {
  loadFile: (handlerPath) => {
    try { decache(handlerPath) } catch (e) {}
    return require(handlerPath)
  },
  sleep: (duration) => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }
}
