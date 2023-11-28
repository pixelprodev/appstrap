const { applyMiddleware, createStore, combineReducers } = require('redux')
const { takeEvery } = require('redux-saga/effects')
const { ERROR, WARNING, INFO, FILE_CHANGE, FILE_UNLINK, FILE_ADD, INIT_GQL } = require('../constants')
const logEvent = require('../actions/logEvent')
const handleFile = require('../actions/handleFile')
const initGql = require('../actions/initGql')
const createSagaMiddleware = require('redux-saga').default

const reducers = combineReducers({
  endpoints: require('./_endpoints'),
  fixtures: require('./_fixtures'),
  gql: require('./_gql'),
  hostMap: require('./_hostMap'),
  state: require('./_state')
})

function * rootSaga () {
  yield takeEvery(INIT_GQL, initGql)
  yield takeEvery([FILE_ADD, FILE_CHANGE, FILE_UNLINK], handleFile)
  yield takeEvery([INFO, ERROR, WARNING], logEvent)
}

function generateStore (initialConfig) {
  const sagaMiddleware = createSagaMiddleware()
  const generatedStore = createStore(reducers, initialConfig, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga)
  return generatedStore
}
module.exports = {
  configure: generateStore
}
