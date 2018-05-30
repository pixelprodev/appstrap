import Endpoint from './Endpoint'

export class Endpoints {
  constructor ({ configData } = {}) {
    this.enableClientSideRouting = false
    this._endpoints = []
    this.setModifier = this.setModifier.bind(this)
    this.clearModifier = this.clearModifier.bind(this)

    // Populate endpoint collection
    this.setCollection({ configData })

    /*
    If config includes a bundle - indicating a single page application - we will enable client side routing
      by adding a catch-all endpoint that serves the basic html for a single page application.
    */
    if (configData.bundle && Object.keys(configData.bundle).length > 0) {
      this.enableClientSideRouting = true
      this.clientSideRoutingEndpoint = (req, res, next) => res.send(this.getSpaHarnessMarkup(configData))
    }
  }

  setCollection ({ configData } = {}) {
    this.clear()
    if (!configData) { return }
    configData.endpoints.forEach(({path, ...methods}, indx) => {
      Object.keys(methods).forEach(method => {
        this.addOne({path, method, handler: configData.endpoints[indx][method]})
      })
    })
  }

  addOne ({path, method, handler}) {
    const newEndpoint = new Endpoint({path, method, handler})
    this._endpoints.push(newEndpoint)
    return newEndpoint
  }

  clear () {
    this._endpoints = []
  }

  fetch ({path, method} = {}) {
    if (path && method) {
      const endpointIndex = this._getEndpointIndex({path, method})
      return this._endpoints[endpointIndex]
    }
    return this._endpoints.sort((a, b) => b.path.length - a.path.length)
  }

  setModifier ({path, method, ...setData}) {
    const endpointIndex = this._getEndpointIndex({path, method})
    this._endpoints[endpointIndex] = {...this._endpoints[endpointIndex], ...setData}
  }

  clearModifier ({path, method}) {
    const endpointIndex = this._getEndpointIndex({path, method})
    const { handler } = this._endpoints[endpointIndex]
    this._endpoints[endpointIndex] = new Endpoint({path, method, handler})
  }

  _getEndpointIndex ({path, method}) {
    return this._endpoints.findIndex(endpoint => {
      return endpoint.path === path && endpoint.method === method
    })
  }

  getSpaHarnessMarkup ({name, version, bundle: {host, webPath}} = this.config) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Appstrap | ${name} - ${version}</title>
      </head>
      <body>
        <div ${host.startsWith('#') ? 'id' : 'class'}="${host.substring(1, host.length)}"></div>
        <script src="${webPath}" type="text/javascript"></script>
      </body>
      </html>
    `
  }
}

export default Endpoints
