const fetch = require('isomorphic-fetch')

class ServiceError extends Error {
  constructor (response) {
    super(response.statusText)
    this.status = response.status
  }
}

async function callService (method, uri, payload = {}) {
  try {
    const params = { method }
    if (Object.keys(payload).length > 0) {
      params.body = JSON.stringify(payload)
    }
    const response = await fetch(uri, params)
    if (response.ok) {
      return isJSONResponse(response.headers)
        ? await response.json()
        : await response.text()
    } else {
      throw new ServiceError(response)
    }
  } catch (e) { throw e }
}

function isJSONResponse (headers) {
  return headers.get('content-type') &&
    headers.get('content-type').indexOf('application/json') !== -1
}

module.exports = callService
