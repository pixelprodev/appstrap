import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { callAPI } from './api'
import { selActiveRoute } from './state/selectors'

export function * loadAppData () {
  const appData = yield call(callAPI, 'GET', '/app-data')
  yield put({type: 'SET_APP_DATA', ...appData})
}

// op = toggle | set
// method indicates which handler we are modifying GET | POST | etc.
// property = error, latency, latencyMS
// value only applies on latencyMS
export function * setRouteModifier ({op, method, property, value}) {
  const routeIndex = yield select(store => store.activeRoute)
  const activeRoute = yield select(selActiveRoute)
  const activeHandler = activeRoute.handlers.find(handler => handler.method === method)
  const modifiers = {...activeHandler}
  modifiers[property] = op === 'toggle' ? !modifiers[property] : value
  try {
    yield call(callAPI, 'PUT', '/endpoint', {routeIndex, method: method.toLowerCase(), modifiers})
    yield put({type: 'LOAD_APP_DATA'})
  } catch (e) {
    console.error(e)
  }
}

export function * reloadConfig () {
  yield call(callAPI, 'GET', '/reload')
  yield delay(500)
  window.location.reload()
}
