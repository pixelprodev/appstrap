import { takeEvery } from 'redux-saga/effects'
import { loadAppData } from '../actions'

export default function * () {
  yield takeEvery('LOAD_APP_DATA', loadAppData)
}
