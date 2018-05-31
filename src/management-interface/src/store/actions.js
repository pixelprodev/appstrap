import { call, put, select } from 'redux-saga/effects'
import { callService } from './api'
import selActivePresets from './selectors/selActivePresets'

export function * initialize () {
  const metadata = yield call(callService, 'GET', 'metadata')
  const endpoints = yield call(callService, 'GET', 'endpoints')
  const presets = yield call(callService, 'GET', 'presets')
  const uniqueEndpoints = new Set()
  endpoints.forEach(endpoint => uniqueEndpoints.add(endpoint.path))
  Array.from(uniqueEndpoints).forEach((path, indx) => {
    endpoints.forEach(endpoint => {
      if (endpoint.path === path) { endpoint.group = indx }
    })
  })

  yield put({type: 'INITIALIZE_COMPLETE', metadata, endpoints, presets})
}

// TODO take another look at this - are we doing stuff thats unnecessary?
export function * setModifier ({property, path, method, value, toggle = true}) {
  const endpoints = yield select(store => store.endpoints)
  const currentEndpointIndex = endpoints.findIndex(endpoint => (endpoint.path === path && endpoint.method === method))
  const currentEndpointValues = endpoints[currentEndpointIndex]
  const payload = {path, method, [property]: toggle ? !currentEndpointValues[property] : value}
  const updatedEndpoint = yield call(callService, 'PUT', 'endpoint', payload)
  endpoints[currentEndpointIndex] = {...endpoints[currentEndpointIndex], ...updatedEndpoint}
  yield put({type: 'UPDATE_ENDPOINTS', endpoints: endpoints.slice(0)})
}

export function * togglePresetActive ({name}) {
  const activePresets = yield select(selActivePresets)
  const isActive = activePresets.find(group => group.name === name)
  const status = yield call(callService, 'PUT', 'presets', {name, active: !isActive})
  yield put({type: 'UPDATE_PRESETS', ...status})
}
