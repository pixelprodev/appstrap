const joi = require('joi')
const { loadFile, defaultModifiers } = require('./_helpers')
const { match } = require('path-to-regexp')
const { jwtDecode } = require('jwt-decode')

class Endpoint {
  constructor (filePath, hostMap = {}, routePrefix = '/') {
    this.path = `${routePrefix}${Endpoint.getPathFromFile(filePath)}`
    this.matcher = match(this.path, { decode: decodeURIComponent })
    const metadata = loadFile(filePath, this.validate)
    const isLambdaFunction = typeof metadata.name !== 'undefined'

    const requestForwardingPath = Object.keys(hostMap).find(pathKey => {
      if (pathKey === '*') { return true }
      const matcher = new RegExp(pathKey)
      return matcher.test(this.path)
    })

    if (metadata.handler) {
      const methods = Object.keys(metadata?.handlerMap) || ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
      methods.forEach(method => {
        this[method] = ({
          ...defaultModifiers,
          handler: isLambdaFunction ? this.mapRequestToLambdaSignature(metadata.handler) : metadata.handler,
          requestForwardingEnabled: !!requestForwardingPath,
          requestForwardingDestination: hostMap[requestForwardingPath] || ''
        })
      })
    } else {
      Object.entries(metadata).forEach(([method, handler]) => {
        this[method] = ({
          ...defaultModifiers,
          handler,
          requestForwardingEnabled: !!requestForwardingPath,
          requestForwardingDestination: hostMap[requestForwardingPath] || ''
        })
      })
    }
  }

  mapRequestToLambdaSignature (handler) {
    return async (context) => {
      let claims = {}
      if (context.req.headers.authorization) {
        claims = jwtDecode(context.req.headers.authorization.replace('Bearer ', ''))
      }
      const event = {
        requestContext: {
          http: { method: context.req.method },
          authorizer: { jwt: { claims } }
        },
        httpMethod: context.req.method,
        path: context.req.path,
        headers: context.req.headers,
        queryStringParameters: context.req.query,
        pathParameters: context.req.params,
        body: context.req.body
      }
      return handler(event, {})
    }
  }

  static getPathFromFile (filePath) {
    return filePath.endsWith('/index.js')
      ? filePath.replace(/.*routes\//, '/').replace('/index.js', '')
      : filePath.replace(/.*routes\//, '/').replace(/\[(.*?)\]/g, ':$1').replace('.js', '')
  }

  validate (filePath, fileData) {
    if (fileData.handler) {
      return true
    } else {
      const routeSchema = joi.object({
        GET: joi.function(),
        PUT: joi.function(),
        POST: joi.function(),
        PATCH: joi.function(),
        DELETE: joi.function()
      })
      const validationResult = routeSchema.validate(fileData)
      if (validationResult.error) {
        throw new Error(`Unable to validate file ${filePath} : ${validationResult.error.message}`)
      }
      return true
    }
  }
}

module.exports = Endpoint
