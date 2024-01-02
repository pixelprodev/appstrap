const strapDefault = require('./helpers/strapDefault')

describe('Interceptor', () => {
  before(() => {
    this.strap = strapDefault()
  })

  it('maps route params appropriately when a route is defined with :params', () => {

  })

  it('applies latency to the request when the latency modifier is enabled')
  it('returns an error to the request when the error modifier is enabled')
})
