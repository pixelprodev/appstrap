class ErrEndpointInvalid extends Error {
  constructor () {
    super(`
      Endpoint supplied without path, handler, or method.  Please check and try again.
    `, 500)
    Error.captureStackTrace(this, this.constructor)
  }
}

class Endpoint {
  constructor (
    {
      path = new ErrEndpointInvalid(),
      method = new ErrEndpointInvalid(),
      handler = new ErrEndpointInvalid()
    },
    {
      error = false,
      errorStatus = 500,
      latency = false,
      latencyMS = 0
    } = {}
  ) {
    this.key = `${method}:::${path}`
    this.path = path
    this.method = method
    this.handler = handler
    this.error = error
    this.errorStatus = errorStatus
    this.latency = latency
    this.latencyMS = latencyMS
  }

  setModifier (dataToSet) {
    Object.keys(dataToSet).forEach(key => {
      this[key] = dataToSet[key]
    })
    return this
  }

  updateHandler (handler) {
    this.handler = handler
  }
}

class Endpoints {
  constructor ({ data } = {}) {
    this.enableClientSideRouting = false
    this._endpoints = []
    this.setModifier = this.setModifier.bind(this)
    this.load({ data })

    /*
    If config includes a bundle - indicating a single page application - we will enable client side routing
      by adding a catch-all endpoint that serves the basic html for a single page application.
    */
    if (data.bundle && Object.keys(data.bundle).length > 0) {
      this.enableClientSideRouting = true
      this.clientSideRoutingEndpoint = (req, res) =>
        res.send(this.getSpaHarnessMarkup(data))
    }
  }

  get collection () {
    return this._endpoints
  }

  load ({ data } = {}) {
    if (!data) { return }
    const endpointsFromData = data.endpoints.map(endpoint => {
      const { path, ...methods } = endpoint
      return Object.keys(methods).map(method =>
        new Endpoint({ path, method, handler: endpoint[method] })
      )
    }).reduce((acc, endpoint) => acc.concat(endpoint))
    if (this._endpoints.length === 0) {
      this._endpoints = endpointsFromData
    } else {
      endpointsFromData.forEach(newEndpoint => {
        const existingEndpoint = this._endpoints.find(e => e.key === newEndpoint.key)
        existingEndpoint
          ? existingEndpoint.updateHandler(newEndpoint.handler)
          : this._endpoints.push(newEndpoint)
      })
    }
  }

  setModifier ({ path, method, endpointKey = `${method}:::${path}`, ...setData }) {
    this._endpoints.find(e => e.key === endpointKey).setModifier(setData)
  }

  getSpaHarnessMarkup ({ name, version, bundle: { host, webPath } }) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Appstrap Single Page Harness | ${name} - ${version}</title>
      </head>
      <body>
        <div ${host.startsWith('#') ? 'id' : 'class'}="${host.substring(1, host.length)}"></div>
        <script src="${webPath}" type="text/javascript"></script>
      </body>
      </html>
    `
  }
}

module.exports = Endpoints
