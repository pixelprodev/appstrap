const Endpoint = require('../../Endpoint')
const GqlOperation = require('../../GqlOperation')
const Fixture = require('../../Fixture')
const { put, select } = require('redux-saga/effects')
const { ERROR, ENTITY_UNLINK } = require('../constants')

function * handleFile ({ type, filePath, routePrefix }) {
  const action = type.split('_')[1]

  let EntityType
  if (filePath.includes('routes')) { EntityType = Endpoint }
  if (filePath.includes('gql')) { EntityType = GqlOperation }
  if (filePath.includes('fixtures')) { EntityType = Fixture }
  if (!EntityType) { return }

  if (action === 'UNLINK') {
    return yield put({ type: ENTITY_UNLINK, filePath })
  }

  const hostMap = yield select(state => state.hostMap)

  try {
    const entity = new EntityType(filePath, hostMap, routePrefix)
    yield put({ type: `ENTITY_${action}`, entity })
  } catch (e) {
    console.error(e.stack)
    yield put({ type: ERROR, msg: e.message })
  }
}

module.exports = handleFile
