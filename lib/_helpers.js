const decache = require('decache')

exports = module.exports = {
  loadFile: (handlerPath, fileValidator, events) => {
    try { decache(handlerPath) } catch (e) {}
    try {
      const fileData = require(handlerPath)
      if (fileValidator) {
        const isValid = fileValidator(handlerPath, fileData, events)
        return isValid ? fileData : null
      } else {
        return fileData
      }
    } catch (e) {
      console.error('unable to require file - skipping')
      return null
    }
  },
  sleep: (duration) => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }
}
