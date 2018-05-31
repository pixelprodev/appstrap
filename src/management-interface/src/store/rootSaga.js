import { takeEvery } from 'redux-saga/effects'
import { initialize, setModifier, togglePresetActive } from './actions'

export default function * () {
  yield takeEvery('INITIALIZE', initialize)
  yield takeEvery('SET_MODIFIER', setModifier)
  yield takeEvery('TOGGLE_PRESET_ACTIVE', togglePresetActive)
}
