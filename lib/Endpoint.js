const joi = require('joi')
const { loadFile, defaultModifiers } = require('./_helpers')
const { match } = require('path-to-regexp')

class Endpoint {
  constructor (filePath, hostMap) {
    this.path = Endpoint.getPathFromFile(filePath)
    this.matcher = match(this.path, { decode: decodeURIComponent })
    const metadata = loadFile(filePath, this.validate)
    const requestForwardingPath = Object.keys(hostMap).find(pathKey => {
      if (pathKey === '*') { return true }
      const matcher = new RegExp(pathKey)
      return matcher.test(this.path)
    })
    Object.entries(metadata).forEach(([method, handler]) => this[method] = ({
      ...defaultModifiers,
      handler,
      requestForwardingEnabled: !!requestForwardingPath,
      requestForwardingDestination: hostMap[requestForwardingPath] || ''
    }))
  }

  static getPathFromFile (filePath) {
    return filePath.replace(/.*routes\//, '/').replace(/\[(.*?)\]/g, ':$1').replace('.js', '')
  }

  validate (filePath, fileData) {
    const routeSchema = joi.object({
      GET: joi.function(),
      PUT: joi.function(),
      POST: joi.function(),
      PATCH: joi.function(),
      DELETE: joi.function()
    })
    const validationResult = routeSchema.validate(fileData)
    if (validationResult.error) {
      throw new Error(validationResult.error.message)
    }
    return true
  }
}

module.exports = Endpoint
