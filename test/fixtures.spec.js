const strapDefault = require('./helpers/strapDefault')
const request = require('supertest')

it('activate fixture X', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('X')

  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ default: true, x: true })
})
it('activate compound fixture (individual) X <- Y', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('X')
  strap.interactor.activateFixture('Y')

  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ default: true, x: true, y: { deep: true } })
})
it('activate compound fixture (individual) X <- Y <- Z', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('X')
  strap.interactor.activateFixture('Y')
  strap.interactor.activateFixture('Z')

  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ z: true })
})
it('activate compound fixture (grouped) X <- Y', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixtures(['X', 'Y'])

  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ default: true, x: true, y: { deep: true } })
})
it('activate compound fixture (grouped) X <- Y <- Z', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixtures(['X', 'Y', 'Z'])

  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ z: true })
})
it('deactivate single fixture X', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('X')

  strap.interactor.deactivateFixture('X')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ default: true })
})
it('deactivate fixture X from X <- Y', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixtures(['X', 'Y'])

  strap.interactor.deactivateFixture('X')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ default: true, y: { deep: true } })
})
it('deactivate fixture Y from X <- Y', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixtures(['X', 'Y'])

  strap.interactor.deactivateFixture('Y')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ default: true, x: true })
})
it('deactivate fixture Y from X <- Y <- Z', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixtures(['X', 'Y', 'Z'])

  strap.interactor.deactivateFixture('Y')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ z: true })
})
it('replaces the entire response when mode === replace', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('Z')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ z: true })
})
it('returns compound result of X (merge) <- Y (deepMerge)', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('X')
  strap.interactor.activateFixture('Y')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ default: true, x: true, y: { deep: true } })
})
it('returns compound result of Y (deepMerge) <- Z (replace)', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('Y')
  strap.interactor.activateFixture('Z')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ z: true })
})
it('returns compound result of Y (deepMerge) <- Z (replace) <- X (merge)', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('Y')
  strap.interactor.activateFixture('Z')
  strap.interactor.activateFixture('X')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ x: true, z: true })
})
it('returns compound result of Z (replace) <- Y (deepMerge)', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('Z')
  strap.interactor.activateFixture('Y')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ z: true, y: { deep: true } })
})
it('returns compound result of Z (replace) <- Y (deepMerge) <- X (merge)', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('Z')
  strap.interactor.activateFixture('Y')
  strap.interactor.activateFixture('X')
  const response = await request(strap).get('/fixture-intercept')
  expect(response.body).toEqual({ x: true, z: true, y: { deep: true } })
})
it('modifies app state when fixture with injectState is activated', async () => {
  const strap = strapDefault()
  let response = await request(strap).get('/state-echo')
  expect(response.body).toEqual({})
  strap.interactor.activateFixture('state-inject')
  response = await request(strap).get('/state-echo')
  expect(response.body).toEqual({ injectedState: true })
})
it('shows the active fixtures and their ordering when calling getStatus', () => {
  const strap = strapDefault()
  strap.interactor.activateFixtures(['Z', 'X'])
  const status = strap.interactor.getStatus()
  const fixtureX = status.fixtures.find(fixture => fixture.name === 'x')
  const fixtureY = status.fixtures.find(fixture => fixture.name === 'y')
  const fixtureZ = status.fixtures.find(fixture => fixture.name === 'z')
  expect(fixtureZ.active).toBe(true)
  expect(fixtureZ.order).toBe(1)
  expect(fixtureY.active).toBe(false)
  expect(fixtureY.order).not.toBeDefined()
  expect(fixtureX.active).toBe(true)
  expect(fixtureX.order).toBe(2)
})
it('replaces original sendState response with a json payload', async () => {
  const strap = strapDefault()
  strap.interactor.activateFixture('Z')
  const response = await request(strap).get('/fixture-replace-status')
  expect(response.body).toEqual({ z: true })
  expect(response.status).not.toBe(404)
})
