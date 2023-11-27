const joi = require('joi')
const { ERROR, WARNING } = require('./constants')

function validateEndpoint (filePath, fileData, events) {
  const routeSchema = joi.object({
    GET: joi.function(),
    PUT: joi.function(),
    POST: joi.function(),
    PATCH: joi.function(),
    DELETE: joi.function()
  })
  const validationResult = routeSchema.validate(fileData)
  if (validationResult.error) {
    events.emit('log', { level: 'error', message: validationResult.error.message })
    return false
  }
  return true
}

function validateGqlOperation (filePath, fileData, events) {
  // todo implement
  return true
}

function validateFixture (filePath, fileData, dispatch) {
  const fixtureSchema = joi.object({
    handlers: joi.array()
      .items(joi.object({
        operationName: joi.string(),
        mode: joi.string().valid('merge', 'mergeDeep', 'replace').required(),
        path: joi.string(),
        method: joi.string().uppercase(),
        handler: joi.function(),
        payload: joi.object()
      }).or('payload', 'handler'))
  })
  const validationResult = fixtureSchema.validate(fileData)
  if (validationResult.error) {
    const shortName = filePath.replace(/.*fixtures\//, '').replace('.js', '')
    dispatch({ type: WARNING, msg: `Skipped loading invalid fixture "${shortName}": ${validationResult.error.message}` })
    return false
  }
  return true
}

module.exports = ({
  validateEndpoint,
  validateGqlOperation,
  validateFixture
})
