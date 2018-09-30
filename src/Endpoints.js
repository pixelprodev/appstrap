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
}

class Endpoints {
  constructor ({ data } = {}) {
    this.enableClientSideRouting = false
    this._endpoints = []
    this.setModifier = this.setModifier.bind(this)
    this.clearModifier = this.clearModifier.bind(this)
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
    this._endpoints = data.endpoints.map(endpoint => {
      const { path, ...methods } = endpoint
      return Object.keys(methods).map(method =>
        new Endpoint({path, method, handler: endpoint[method]})
      )
    }).reduce((acc, endpoint) => acc.concat(endpoint))
  }

  setModifier ({path, method, endpointKey = `${method}:::${path}`, ...setData}) {
    const indx = this._endpoints.find(endpoint => endpoint.key === endpointKey)
    this._endpoints[indx] = {...this._endpoints[indx], ...setData}
  }

  clearModifier ({path, method, endpointKey = `${method}:::${path}`}) {
    const indx = this._endpoints.find(endpoint => endpoint.key === endpointKey)
    const { handler } = this._endpoints[indx]
    this._endpoints[indx] = new Endpoint({path, method, handler})
  }

  getSpaHarnessMarkup ({name, version, bundle: {host, webPath}}) {
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
