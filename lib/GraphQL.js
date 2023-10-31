async function handleGqlRequest (req, res, next) {
  req.isGraph = true
  const { operationName } = req.body
  if (typeof operationName === 'undefined') {
    throw new Error('no operationName provided')
  }

  const handler = this.handlers.pick({ operation: operationName })
  if (handler && handler.enabled) {
    await handler.execute(req, res)
  } else {
    next()
  }
}

module.exports = {
  handleGqlRequest
}
