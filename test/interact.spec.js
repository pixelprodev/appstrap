const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')
const now = require('performance-now')
const express = require('express')

it('allows for toggling a handler via interactor setModifier', async () => {
  const app = express()
  const strap = strapDefault()
  app.use(strap)
  app.get('/foo', (req, res) => res.send('this is the non-intercepted response'))

  strap.interactor.setHandlerEnabled({ path: 'foo', method: 'get', enabled: false })
  const disabledResponse = await request(app).get('/foo')
  expect(disabledResponse.text).toEqual('this is the non-intercepted response')
  strap.interactor.setHandlerEnabled({ path: 'foo', method: 'get', enabled: true })
  const enabledResponse = await request(app).get('/foo')
  expect(enabledResponse.text).toEqual('foo route intercepted')
})

it('allows for toggling a handler over REST', async () => {
  const app = express()
  const strap = strapDefault()
  app.use(strap)
  app.get('/foo', (req, res) => res.send('this is the non-intercepted response'))

  await request(strap).post('/__interactor/setHandlerEnabled').send({ path: 'foo', method: 'get', enabled: false })
  const disabledResponse = await request(app).get('/foo')
  expect(disabledResponse.text).toEqual('this is the non-intercepted response')
  await request(strap).post('/__interactor/setHandlerEnabled').send({ path: 'foo', method: 'get', enabled: true })
  const enabledResponse = await request(app).get('/foo')
  expect(enabledResponse.text).toEqual('foo route intercepted')
})

it('allows for setting error response on an endpoint via interactor setModifier', async () => {
  const strap = strapDefault()
  strap.interactor.setModifier({ path: 'foo', method: 'get', error: true, errorCode: 400 })
  const response = await request(strap).get('/foo')
  expect(response.status).toEqual(400)
})

it('allows for setting error response on an endpoint over REST', async () => {
  const strap = strapDefault()
  const setResponse = await request(strap).post('/__interactor/setModifier').send({ path: 'foo', method: 'get', error: true, errorCode: 400 })
  expect(setResponse.status).toEqual(200)
  const response = await request(strap).get('/foo')
  expect(response.status).toEqual(400)
})

it('allows for setting latency delayed response on an endpoint via interactor setModifier', async () => {
  const strap = strapDefault()
  const latencyMS = 50
  strap.interactor.setModifier({ path: 'foo', method: 'get', latency: true, latencyMS })
  const before = Math.floor(now())
  const response = await request(strap).get('/foo')
  const after = Math.floor(now())
  expect(after - before).toBeGreaterThan(latencyMS)
  expect(response.status).toEqual(200)
})

it('allows for setting latency delayed response on an endpoint over REST', async () => {
  const strap = strapDefault()
  const latencyMS = 50
  await request(strap).post('/__interactor/setModifier').send({ path: 'foo', method: 'get', latency: true, latencyMS })
  const before = Math.floor(now())
  const delayedResponse = await request(strap).get('/foo')
  const after = Math.floor(now())
  expect(after - before).toBeGreaterThan(latencyMS)
  expect(delayedResponse.status).toEqual(200)
})

xit('allows for removing all modifiers on a handler via interactor', async () => {
  const strap = strapDefault()
  strap.interactor.clearModifiers({ path: 'foo', method: 'get' })
})

xit('allows for removing all modifiers on a handler over REST', async () => {
  const strap = strapDefault()
  await request(strap).post('/__interactor/clearModifiers').send({ path: 'foo', method: 'get' })
})

it('injects state via interactor.injectState method', async () => {
  const strap = strapDefault()
  strap.interactor.injectState({ injected: true })
  const response = await request(strap).get('/state-echo')
  expect(response.body).toEqual({ injected: true })
})

it('injects state via interactor.injectState REST route', () => {

})
