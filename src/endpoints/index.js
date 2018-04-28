import Endpoint from './Endpoint'

export class Endpoints {
  constructor () {
    this._endpoints = []
  }

  addOne ({path, method, handler}) {
    this._endpoints.push(new Endpoint({path, method, handler}))
  }

  clear () {
    this._endpoints = []
  }

  fetch ({path, method} = {}) {
    if (path && method) {
      let endpointIndex = this._endpoints.findIndex(endpoint => endpoint.path === path && endpoint.method === method)
      return this._endpoints[endpointIndex]
    }
    return this._endpoints
  }

  setModifier ({path, method, ...setData}) {
    let endpointIndex = this._endpoints.findIndex(endpoint => endpoint.path === path && endpoint.method === method)
    this._endpoints[endpointIndex] = {...this._endpoints[endpointIndex], ...setData}
  }

  clearModifier ({path, method}) {
    let endpointIndex = this._endpoints.findIndex(endpoint => endpoint.path === path && endpoint.method === method)
    const { handler } = this._endpoints[endpointIndex]
    this._endpoints[endpointIndex] = new Endpoint({path, method, handler})
  }
}

export default new Endpoints()
