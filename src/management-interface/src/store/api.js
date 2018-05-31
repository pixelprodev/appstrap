import { call } from 'redux-saga/effects'

export function * callService (method, uri, payload = {}) {
  try {
    const params = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=-1,private',
        'Pragma': 'no-cache'
      }
    }
    if (Object.keys(payload).length > 0) {
      params.body = JSON.stringify(payload)
    }
    const response = yield call(fetch, `/data/${uri}`, params)
    if (response.ok) {
      return isJSONResponse(response.headers)
        ? yield call([response, response.json])
        : null
    } else {
      throw new Error(response)
    }
  } catch (e) { throw e }
}

export function isJSONResponse (headers) {
  return headers.get('content-type') &&
    headers.get('content-type').indexOf('application/json') !== -1
}
