import { takeEvery } from 'redux-saga/effects'
import { loadAppData, setRouteModifier, reloadConfig } from '../actions'

export default function * () {
  yield takeEvery('LOAD_APP_DATA', loadAppData)
  yield takeEvery('SET_ROUTE_MODIFIER', setRouteModifier)
  yield takeEvery('RELOAD_CONFIG', reloadConfig)
}
