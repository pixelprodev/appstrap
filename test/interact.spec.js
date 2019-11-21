const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')
const now = require('performance-now')

describe('Interacting with handlers', () => {
  it('allows for toggling a handler via interactor setModifier', () => {
    const strap = strapDefault()
    strap.interactor.toggleHandler({ path: 'foo', method: 'get' })
  })
  it('allows for toggling a handler over REST', async () => {
    const strap = strapDefault()
    const setResponse = await request(strap).post('/__interactor/toggleHandler').send({ path: 'foo', method: 'get' })
    expect(setResponse.status).toEqual(200)
  })
  it('allows for setting error response on an endpoint via interactor setModifier', async () => {
    const strap = strapDefault()
    strap.interactor.setModifier({ path: 'foo', method: 'get', error: true, status: 400 })
    const response = await request(strap).get('/foo')
    expect(response.status).toEqual(400)
  })
  it('allows for setting error response on an endpoint over REST', async () => {
    const strap = strapDefault()
    const setResponse = await request(strap).post('/__interactor/setModifier').send({ path: 'foo', method: 'get', error: true, status: 400 })
    expect(setResponse.status).toEqual(200)
    const response = await request(strap).get('/foo')
    expect(response.status).toEqual(400)
  })
  it('allows for setting latency delayed response on an endpoint via interactor setModifier', async () => {
    const strap = strapDefault()
    const latencyMS = 100
    strap.interactor.setModifier({ path: 'foo', method: 'get', latency: true, latencyMS })
    const before = Math.floor(now())
    const response = await request(strap).get('/foo')
    const after = Math.floor(now())
    expect(after - before).toBeGreaterThan(latencyMS)
    expect(response.status).toEqual(200)
  })
  it('allows for setting latency delayed response on an endpoint over REST', async () => {
    const strap = strapDefault()
    const latencyMS = 100
    const setResponse = await request(strap).post('/__interactor/setModifier').send({ path: 'foo', method: 'get', latency: true, latencyMS })
    expect(setResponse.status).toEqual(200)
    const before = Math.floor(now())
    const delayedResponse = await request(strap).get('/foo')
    const after = Math.floor(now())
    expect(after - before).toBeGreaterThan(latencyMS)
    expect(delayedResponse.status).toEqual(200)
  })
  it('allows for removing all modifiers on a handler via interactor', async () => {
    const strap = strapDefault()
    strap.interactor.clearModifiers({ path: 'foo', method: 'get' })
  })
  it('allows for removing all modifiers on a handler over REST', async () => {
    const strap = strapDefault()
    const setResponse = await request(strap).post('/__interactor/clearModifiers').send({ path: 'foo', method: 'get' })
    expect(setResponse.status).toEqual(200)
  })
})
