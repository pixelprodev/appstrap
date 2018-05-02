import Endpoint from './Endpoint'

export class Endpoints {
  constructor () {
    this._endpoints = []
    this.setModifier = this.setModifier.bind(this)
    this.clearModifier = this.clearModifier.bind(this)
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
    return this._endpoints.findIndex(endpoint => endpoint.path === path && endpoint.method === method)
  }
}

const singleton = new Endpoints()
export default singleton
