const supertest = require('supertest')
const strapDefault = require('./helpers/strapDefault')

describe('Responses', () => {
  it('does something', async () => {
    const strap = strapDefault()
    const response = await supertest(strap).get('/foo')
    expect(response.text).toEqual(JSON.stringify({ hello: 'world', foo: 'bar' }))
  })
  it('Handles route parameters when specified in folder structure', async () => {
    const strap = strapDefault()
    const response = await supertest(strap).get('/nested/fizz')
    console.log(response.text)
  })
  it('Prioritizes defined routes and falls back to route parameter when provided in folder structure', async () => {
    const strap = strapDefault()
    const response = await supertest(strap).get('/nested/baz')
    expect(response.text).toEqual('hello world nested/baz')
  })
})
