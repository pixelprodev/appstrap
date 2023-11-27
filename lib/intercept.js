const axios = require('axios')
const mergeDeep = require('lodash.merge')
async function intercept (context, config) {
  let forwardedRequest = false
  const { endpoints, config: stateConfig } = config.state.getState()

  const { path, method } = context.req
  const matchingEndpoint = endpoints.find(endpoint => endpoint.method === method && endpoint.matcher(path))
  if (!matchingEndpoint) { return context.next() }

  // we have to manually populate params because we are matching all inbound routes and express doesn't do it for us
  const { params } = matchingEndpoint.matcher(path)
  if (params) { context.req.params = params }

  let handler
  if (matchingEndpoint.requestForwardingEnabled && matchingEndpoint.requestForwardingDestination !== '') {
    forwardedRequest = true
    handler = forwardRequest
  } else {
    handler = matchingEndpoint.handler
  }

  if (!handler) { return context.next() }

  const { statusCode, headers, payload } = normalizeResponse(await handler(context))
  const appliedPayload = applyFixtures(context, payload, stateConfig)

  if (forwardedRequest) {
    context.res.status = statusCode
    context.res.set(headers)
    context.res.write(JSON.stringify(appliedPayload))
    context.res.end()
  } else {
    return context.res.json(appliedPayload)
  }
}
function normalizeResponse (handlerResponse) {
  return ({
    statusCode: handlerResponse.statusCode || 200,
    headers: handlerResponse.headers || {},
    payload: handlerResponse.payload || handlerResponse
  })
}

function applyFixtures (context, payload, config) {
  const { fixtures } = config.state.getState()
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

async function forwardRequest (context) {
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
  try {
    const { status, headers, data } = await axios(options)
    let chunks = ''
    data.on('data', (chunk) => (chunks += chunk))
    data.on('end', () => {
      return ({ status, headers, payload: JSON.parse(chunks.toString()) })
    })
  } catch (e) {
    console.error(e)
    return {}
  }
}

module.exports = exports = intercept
