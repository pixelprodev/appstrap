const { applyMiddleware, createStore, combineReducers } = require('redux')
const { takeEvery } = require('redux-saga/effects')
const { ERROR, WARNING, INFO } = require('../constants')
const { logEvent } = require('../logEvent')
const createSagaMiddleware = require('redux-saga').default

const reducers = combineReducers({
  config: require('./_config'),
  files: require('./_files'),
  endpoints: require('./_endpoints'),
  gqlOperations: require('./_gqlOperations'),
  fixtures: require('./_fixtures')
})

function * rootSaga () {
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
