const Appstrap = require('../')
const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')
const withStateConfig = require('./_configs/withStateConfig')

describe('app internal state', () => {
  it('defaults to empty object when no initialState is defined', () => {
    const strap = strapDefault()
    expect(strap.memoryStore.state).toEqual({})
  })
  it('loads initialState into app state when defined', () => {
    const strap = new Appstrap({ config: './test/_configs/withStateConfig.js' })
    expect(strap.memoryStore.state).toEqual(withStateConfig.initialState)
  })
  it('adds state to the req and res objects', async () => {
    const strap = new Appstrap({ config: './test/_configs/withStateConfig.js' })
    const response = await request(strap).get('/echo-state')
    expect(response.body).toEqual(withStateConfig.initialState)
  })
  // right now this is only true if state is not completely overwritten
  // state = 'foo' wont work, state.foo = 'buzz' will
  it('maintains changes to state for as long as the strap is live', async () => {
    const strap = new Appstrap({ config: './test/_configs/withStateConfig.js' })
    await request(strap).post('/update-state').send({ zip: 'zop' })
    const response = await request(strap).get('/echo-state')
    expect(response.body).not.toEqual(withStateConfig.initialState)
    expect()
  })
})
