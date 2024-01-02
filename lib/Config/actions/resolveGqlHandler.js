function resolveGqlHandler (context, gqlOperations) {
  const operationName = context.req.body.operationName
  return gqlOperations.find(operation => operation.operationName === operationName)
}

module.exports = exports = resolveGqlHandler
