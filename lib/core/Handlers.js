const { convertPathToKey } = require('./utils')

class Handlers {
  constructor (config) {
    this.collection = []
    this.update = this.mapCollection
    this.mapCollection(config)
  }

  mapCollection (config) {
    const hasHosts = typeof config.handlers === 'undefined'
    if (hasHosts) {
      Object.entries(config).forEach(([hostName, { routeMap, handlers, host }]) => {
        const hostInfo = { hostName, ...host }
        return this.mapRoutes(routeMap, handlers, hostInfo)
      })
    } else {
      const { routeMap, handlers } = config
      return this.mapRoutes(routeMap, handlers)
    }
  }

  mapRoutes (routeMap, handlers, hostInfo) {
    routeMap(handlers).forEach(({ path, ...methods }) => {
      Object.entries(methods).forEach(([method, fn]) => {
        this.collection.push(new Handler({ path, method, fn, hostInfo }))
      })
    })
  }
}

class Handler {
  constructor ({ path, method, fn, hostInfo = {} }) {
    this.fn = fn
    this.key = convertPathToKey(path, method, hostInfo.hostName)
    this.ingressPath = this.mapIngressPath(hostInfo, path)
    this.path = path
    this.method = method
    this.setDefaults()
  }

  mapIngressPath (hostInfo, path) {
    if (hostInfo.url) {
      return `//${hostInfo.url}${path}`
    }
    if (hostInfo.env?.length > 0) {
      hostInfo.env.forEach(envVar => {
        if (process.env[envVar]) {
          return `${process.env[envVar]}${path}`
        }
      })
      throw new Error(`Environment variables provided for host: ${hostInfo.hostName} but those variables are not in the environment scope`)
    }
    return path
  }

  setDefaults () {
    this.error = false
    this.errorCode = 500
    this.errorMessage = 'generated error'
    this.latency = false
    this.latencyMS = 0
    this.disabled = false
    this.fixtures = new Map()
  }

  async execute (context) {
    try {
      await this.fn(context)
    } catch (e) {
      // todo should we ever get here or is a bad fn a configuration error?
    }
    return context
  }
}

module.exports = Handlers
