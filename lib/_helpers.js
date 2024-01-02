const path = require('path')
const decache = require('decache')

exports = module.exports = {
  loadFile: (handlerPath, fileValidator) => {
    const resolvedPath = path.join(process.cwd(), handlerPath)
    try { decache(resolvedPath) } catch (e) { }

    const fileData = require(resolvedPath)
    if (fileValidator) {
      const isValid = fileValidator(resolvedPath, fileData)
      return isValid ? fileData : null
    } else {
      return fileData
    }
  },
  sleep: (duration) => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  },
  sortByOrder: (array) => {
    return array.sort((a, b) => a.order - b.order)
  },
  defaultModifiers: {
    error: false,
    errorCode: '',
    latency: false,
    latencyMS: '',
    enabled: true,
    requestForwardingEnabled: false,
    requestForwardingDestination: ''
  }
}
