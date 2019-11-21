const { normalizeRoutePathPrefix } = require('./_helpers')
const mergeDeep = require('lodash.merge')

class Fixture {
  constructor ({ injectState, routes }) {
    this.injectState = injectState
    this.routes = new Map()
    if (routes) {
      this.mapRoutes(routes)
    }
  }

  mapRoutes (routes) {
    routes.map(({ path, mode, ...methods }) => {
      Object.keys(methods).forEach(method => {
        const normalizedPath = normalizeRoutePathPrefix(path)
        const id = `${normalizedPath}:::${method}`
        this.routes.set(id, this.routeHandler({ mode, payload: methods[method] }))
      })
    })
  }

  routeHandler ({ mode = 'merge', payload }) {
    return (data) => {
      switch (mode) {
        case 'replace':
          return payload
        case 'deepMerge':
        case 'mergeDeep':
          return mergeDeep(data, payload)
        default: // merge
          return ({ ...data, ...payload })
      }
    }
  }
}

exports = module.exports = Fixture
