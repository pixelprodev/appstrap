const axios = require('axios')
const mergeDeep = require('lodash.merge')
const selEndpoints = require('./Config/actions/selEndpoints')
const { sleep } = require('./_helpers')

class Interceptor {
  constructor (config) {
    this.config = config
  }

  async intercept (context) {
    let forwardedRequest = false
    const endpoints = selEndpoints(this.config.state.getState())
    context.state = this.config.state.getState().state

    const { path, method } = context.req
    const matchingEndpoint = endpoints.find(endpoint => endpoint.matcher(path))
    if (!matchingEndpoint || typeof matchingEndpoint[method] === 'undefined') {
      return context.next()
    }

    // we have to manually populate params because we are matching all inbound routes and express doesn't do it for us
    const { params } = matchingEndpoint.matcher(path)
    if (params) { context.req.params = params }

    let handler
    if (matchingEndpoint[method].latency) {
      await sleep(+matchingEndpoint[method].latencyMS)
    }
    if (matchingEndpoint[method].error) {
      return context.res.sendStatus(+matchingEndpoint[method].errorCode || 500)
    }

    if (matchingEndpoint[method].requestForwardingEnabled && matchingEndpoint[method].requestForwardingDestination !== '') {
      forwardedRequest = true
      context.destination = matchingEndpoint[method].requestForwardingDestination
      handler = this.forwardRequest
    } else {
      handler = matchingEndpoint[method].handler
    }

    if (!handler) { return context.next() }

    let { statusCode, headers, body } = this.normalizeResponse(await handler(context))

    // for cases when the handler itself pre-stringifies the body - re-convert to object
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch (e) {}
    }
    const appliedPayload = this.applyFixtures(context, body)

    if (forwardedRequest) {
      context.res.status = statusCode
      context.res.set(headers)
      context.res.write(JSON.stringify(appliedPayload))
      context.res.end()
    } else {
      return context.res.json(appliedPayload)
    }
  }

  normalizeResponse (handlerResponse) {
    return ({
      statusCode: handlerResponse.statusCode || 200,
      headers: handlerResponse.headers || {},
      body: handlerResponse.body || handlerResponse
    })
  }

  applyMiddleware (context) {

  }

  applyFixtures (context, payload) {
    const { fixtures } = this.config.state.getState()
    if (fixtures.active.size === 0) { return payload }
    return Array.from(fixtures.active).reduce((response, name) => {
      try {
        const fixture = fixtures.collection.find(fixture => fixture.name === name)
        let updater
        if (context.req.body && context.req.body.operationName) {
          updater = fixture.handlers.find(handler => handler.operationName === context.req.body.operationName)
        } else {
          updater = fixture.handlers.find(handler =>
            (handler.path === context.req.path) &&
            (handler.method.toUpperCase() === context.req.method.toUpperCase()))
        }
        if (!updater) { return payload }
        const result = updater.handler ? updater.handler(context.req, payload) : updater.payload
        switch (updater.mode) {
          case 'replace':
            return result
          case 'mergeDeep':
            return mergeDeep(payload, result)
          default: // merge
            return Object.assign(payload, result)
        }
      } catch (e) {
        console.error(e)
        return payload
      }
    }, payload)
  }

  forwardRequest (context) {
    const options = {
      responseType: 'stream',
      method: context.req.method.toLowerCase(),
      url: context.destination,
      headers: context.req.headers,
      useCredentials: true
    }
    if (context.req.body) {
      options.data = context.req.body
    }
    return new Promise((resolve, reject) => {
      try {
        axios(options).then(({ status, headers, data }) => {
          let chunks = ''
          data.on('data', (chunk) => (chunks += chunk))
          data.on('end', () => {
            resolve({ status, headers, payload: JSON.parse(chunks.toString()) })
          })
        })
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  }
}

module.exports = exports = Interceptor
