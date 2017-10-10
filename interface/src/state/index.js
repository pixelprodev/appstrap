import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer'
import rootSaga from './rootSaga'

export function generateStore ({mode = (process.env.NODE_ENV || 'test'), injectedState = {}}) {
  let sagaMiddleware = createSagaMiddleware()
  let generatedStore = mode === 'development'
    ? createStore(reducer, injectedState, composeWithDevTools(applyMiddleware(sagaMiddleware)))
    : createStore(reducer, injectedState, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga)
  return generatedStore
}
const State = generateStore({})
export default State
