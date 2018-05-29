import Endpoint from './Endpoint'

export class Endpoints {
  constructor ({ configData }) {
    this._endpoints = []
    this.setModifier = this.setModifier.bind(this)
    this.clearModifier = this.clearModifier.bind(this)

    this.setCollection({ configData })
  }

  setCollection ({ configData }) {
    this.clear()
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
}

export default Endpoints
