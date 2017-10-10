import { call, put } from 'redux-saga/effects'
import { callAPI } from './api'

export function * loadAppData () {
  const appData = yield call(callAPI, 'GET', '/app-data')
  yield put({type: 'SET_APP_DATA', ...appData})
}
