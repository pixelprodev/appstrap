const Route = require('./Route')
const { loadFile } = require('../_helpers')
const { match } = require('path-to-regexp')
const { validateRoute, validateGqlOperation } = require('./validators')
const path = require('path')

class Routes {
  constructor ({ files, gqlEndpoint, applyFixtures }) {
    this.files = files
    this.collection = new Map()

    if (gqlEndpoint) {
      this.collection.set(
        gqlEndpoint,
        new Route({
          methods: ['POST'],
          operation: '*',
          endpoint: gqlEndpoint,
          applyFixtures
        })
      )
    }

    const routes = this.files.filter(file => file.includes('/routes/'))
    for (const route of routes) {
      const routeDefinition = loadFile(route, validateRoute)
      if (routeDefinition) {
        const endpoint = route.replace(/.*routes\//, '/').replace(/\[(.*?)\]/g, ':$1').replace('.js', '')
        const { ...methods } = routeDefinition
        this.collection.set(
          endpoint,
          new Route({
            type: 'rest',
            endpoint,
            methods,
            applyFixtures
          })
        )
      }
    }

    const gqlOperations = this.files.filter(file => file.includes('/gql/'))
    for (const gqlOperation of gqlOperations) {
      const operationDefinition = loadFile(gqlOperation, validateGqlOperation)
      if (operationDefinition) {
        this.collection.set(
          path.basename(gqlOperation, '.js'),
          new Route({
            type: 'gql',
            ...operationDefinition,
            applyFixtures
          })
        )
      }
    }
  }

  pick ({ path, method, operation }) {
    if (operation) {
      return this.collection.get(operation)
    }
    return Array.from(this.collection.values()).find((handler) => {
      const matcher = match(handler.path, { decode: decodeURIComponent })
      return matcher(path) !== false && handler.method.toUpperCase() === method.toUpperCase()
    })
  }
}

module.exports = Routes
