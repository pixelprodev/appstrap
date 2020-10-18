const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')
const expect = require('expect')

describe('Strap history', () => {
  it('records request history in order', async () => {
    const strap = strapDefault()
    await request(strap).get('/foo')
    await request(strap).post('/bar').send('bar payload 1')
    await request(strap).get('/foo')
    await request(strap).get('/foo')
    await request(strap).post('/bar').send('bar payload 2')
    expect(strap.history).toHaveLength(5)
    expect(strap.history[0].reqPath).toBe('/foo')
    expect(strap.history[1].reqPath).toBe('/bar')
  })
  it('resets history when calling strap.reset()', async () => {
    const strap = strapDefault()
    await request(strap).get('/foo')
    expect(strap.history).toHaveLength(1)
    strap.reset()
    expect(strap.history).toHaveLength(0)
  })
})
