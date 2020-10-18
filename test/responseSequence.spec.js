const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')
const expect = require('expect')

describe('Response Sequence', () => {
  it('overrides a response handler with a provided sequence', async () => {
    const strap = strapDefault()
    const { successfulResponse } = strap.interactor.helpers
    strap.interactor.addResponseSequence([{
      path: 'foo',
      method: 'get',
      responseSequence: [
        successfulResponse('response 1'),
        successfulResponse('response 2'),
        successfulResponse('response 3')
      ]
    }])
    const responses = await Promise.all([
      request(strap).get('/foo'), request(strap).get('/foo'), request(strap).get('/foo'), request(strap).get('/foo')
    ])
    expect(responses[0].text).toBe('response 1')
    expect(responses[1].text).toBe('response 2')
    expect(responses[2].text).toBe('response 3')
    // defaults to standard route interceptor once the sequence is finished
    expect(responses[3].text).toBe('foo route intercepted')
  })
  it('returns a provided express response handler', async () => {
    const strap = strapDefault()
    strap.interactor.addResponseSequence([{
      path: 'foo',
      method: 'get',
      responseSequence: [(req, res) => res.send('overrided once')]
    }])
    const response = await request(strap).get('/foo')
    expect(response.text).toBe('overrided once')
    const followonResponse = await request(strap).get('/foo')
    expect(followonResponse.text).toBe('foo route intercepted')
  })
  it('returns an error when provided', async () => {
    const strap = strapDefault()
    const { errorResponse } = strap.interactor.helpers
    strap.interactor.addResponseSequence([{
      path: 'foo',
      method: 'get',
      responseSequence: [errorResponse('test error')]
    }])
    const response = await request(strap).get('/foo')
    expect(response.status).toBe(500)
    expect(response.text).toBe('test error')
    const followonResponse = await request(strap).get('/foo')
    expect(followonResponse.status).toBe(200)
    expect(followonResponse.text).toBe('foo route intercepted')
  })
  it('returns a delayed error', async () => {
    const strap = strapDefault()
    const { successfulResponse, errorResponse } = strap.interactor.helpers
    strap.interactor.addResponseSequence([{
      path: 'foo',
      method: 'get',
      responseSequence: [
        successfulResponse('response 1'),
        errorResponse('special error message not found', 404),
        successfulResponse('response 2')
      ]
    }])
    const responses = await Promise.all([
      request(strap).get('/foo'), request(strap).get('/foo'), request(strap).get('/foo'), request(strap).get('/foo')
    ])
    expect(responses[0].text).toBe('response 1')
    expect(responses[0].status).toBe(200)
    expect(responses[1].text).toBe('special error message not found')
    expect(responses[1].status).toBe(404)
    expect(responses[2].text).toBe('response 2')
    // defaults to standard route interceptor once the sequence is finished
    expect(responses[3].text).toBe('foo route intercepted')
  })
})
