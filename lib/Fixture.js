const { normalizeRoutePathPrefix } = require('./_helpers')
const mergeDeep = require('lodash.merge')

class Fixture {
  constructor ({ routes }) {
    this.routes = new Map()
    this.mapRoutes(routes)
  }

  mapRoutes (routes) {
    routes.map(({ path, mode, ...methods }) => {
      Object.keys(methods).forEach(method => {
        const normalizedPath = normalizeRoutePathPrefix(path)
        const key = `${normalizedPath}:::${method}`
        this.routes.set(key, this.routeHandler({ mode, payload: methods[method] }))
      })
    })
  }

  routeHandler ({ mode = 'merge', payload }) {
    return (data) => {
      switch (mode) {
        case 'replace':
          return payload
        case 'deepMerge':
          return mergeDeep(data, payload)
        default: // merge
          return ({ ...data, ...payload })
      }
    }
  }
}

exports = module.exports = Fixture
