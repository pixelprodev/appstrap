import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'
import reducer from './reducer'

export function generateStore () {
  let sagaMiddleware = createSagaMiddleware()
  let generatedStore = process.env.NODE_ENV !== 'production'
    ? createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))
    : createStore(reducer, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga)
  return generatedStore
}
const State = generateStore()
export default State
