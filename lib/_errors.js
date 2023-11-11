const ERR_NO_REPOSITORY_DEFINED = 'No repository location provided.  Please provide a location via the `repository` argument in your instance constructor.'
const ERR_NO_REPOSITORY_FOUND = (directory) => `No configuration found at ${directory}`
const ERR_REPOSITORY_EMPTY = 'No configuration files found in repository.  Nothing to do.'
const ERR_NO_MATCHING_ENDPOINT_UPDATE = 'No matching endpoint to update'
const ERR_NO_MATCHING_METHOD_UPDATE = 'No matching method to update'
const ERR_METHOD_REQUIRED_TO_UPDATE = 'This operation must be performed on a single method.'

const WARN_NO_GQL_ENDPOINT = 'GraphQL files detected but no endpoint provided.  No endpoint handlers can be created until gqlEndpoint is specified'

module.exports = exports = ({
  ERR_NO_REPOSITORY_DEFINED,
  ERR_NO_REPOSITORY_FOUND,
  ERR_REPOSITORY_EMPTY,
  ERR_NO_MATCHING_ENDPOINT_UPDATE,
  ERR_NO_MATCHING_METHOD_UPDATE,
  ERR_METHOD_REQUIRED_TO_UPDATE,
  WARN_NO_GQL_ENDPOINT
})
