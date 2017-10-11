import { takeEvery } from 'redux-saga/effects'
import { loadAppData, setRouteModifier } from '../actions'

export default function * () {
  yield takeEvery('LOAD_APP_DATA', loadAppData)
  yield takeEvery('SET_ROUTE_MODIFIER', setRouteModifier)
}
