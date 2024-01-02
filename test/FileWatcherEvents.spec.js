const { configure } = require('../lib/Config/state')
const expect = require('expect')
const { ENTITY_ADD, ENTITY_UNLINK, FILE_UNLINK, FILE_CHANGE, ENTITY_CHANGE } = require('../lib/Config/constants')
const Fixture = require('../lib/Fixture')
const Endpoint = require('../lib/Endpoint')
const GqlOperation = require('../lib/GqlOperation')
const DispatchLog = require('./helpers/dispatchLog')

describe('Filewatcher Events', () => {
  beforeEach(() => {
    this.dispatchLog = new DispatchLog()
    this.state = configure({}, [this.dispatchLog.captureHistory.bind(this.dispatchLog)])
  })
  afterEach(() => {
    this.dispatchLog.resetHistory()
  })
  describe('New file created', () => {
    it('ignores files that are not fixtures, gql handlers, or endpoints', () => {
      this.state.dispatch({ type: 'FILE_ADD', filePath: '/some/non-entity' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_ADD)
      expect(entityDispatch).not.toBeDefined()
    })
    it('adds a new fixture when file added', () => {
      this.state.dispatch({ type: 'FILE_ADD', filePath: '/test/configs/default/fixtures/testOne.js' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_ADD)
      expect(entityDispatch).toBeDefined()
      expect(entityDispatch.entity instanceof Fixture).toBe(true)
    })
    it('adds a new endpoint when file added', () => {
      this.state.dispatch({ type: 'FILE_ADD', filePath: '/test/configs/default/routes/foo.js' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_ADD)
      expect(entityDispatch).toBeDefined()
      expect(entityDispatch.entity instanceof Endpoint).toBe(true)
    })
    it('adds a new gql handler when file added', () => {
      this.state.dispatch({ type: 'FILE_ADD', filePath: '/test/configs/withGQL/gql/RunQueryOne.js' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_ADD)
      expect(entityDispatch).toBeDefined()
      expect(entityDispatch.entity instanceof GqlOperation).toBe(true)
    })
  })
  describe('File updated', () => {
    it('ignores files that are not fixtures, gql handlers, or endpoints', () => {
      this.state.dispatch({ type: FILE_CHANGE, filePath: '/some/non-entity' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_CHANGE)
      expect(entityDispatch).not.toBeDefined()
    })
    it('adds a new fixture when file updated', () => {
      this.state.dispatch({ type: FILE_CHANGE, filePath: '/test/configs/default/fixtures/testOne.js' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_CHANGE)
      expect(entityDispatch).toBeDefined()
      expect(entityDispatch.entity instanceof Fixture).toBe(true)
    })
    it('adds a new endpoint when file updated', () => {
      this.state.dispatch({ type: FILE_CHANGE, filePath: '/test/configs/default/routes/foo.js' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_CHANGE)
      expect(entityDispatch).toBeDefined()
      expect(entityDispatch.entity instanceof Endpoint).toBe(true)
    })
    it('adds a new gql handler when file updated', () => {
      this.state.dispatch({ type: FILE_CHANGE, filePath: '/test/configs/withGQL/gql/RunQueryOne.js' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_CHANGE)
      expect(entityDispatch).toBeDefined()
      expect(entityDispatch.entity instanceof GqlOperation).toBe(true)
    })
  })
  describe('File removed', () => {
    it('ignores files that are not fixtures, gql handlers, or endpoints', () => {
      this.state.dispatch({ type: FILE_UNLINK, filePath: '/some/non-entity' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_UNLINK)
      expect(entityDispatch).not.toBeDefined()
    })
    it('sends an ENTITY_UNLINK call with the fixture filePath to the reducers', () => {
      this.state.dispatch({ type: FILE_UNLINK, filePath: '/test/configs/default/fixtures/testOne.js' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_UNLINK)
      expect(entityDispatch).toBeDefined()
      expect(entityDispatch.filePath).toBeDefined()
    })
    it('sends an ENTITY_UNLINK call with the route filePath to the reducers', () => {
      this.state.dispatch({ type: FILE_UNLINK, filePath: '/test/configs/default/routes/foo.js' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_UNLINK)
      expect(entityDispatch).toBeDefined()
      expect(entityDispatch.filePath).toBeDefined()
    })
    it('sends an ENTITY_UNLINK call with the gql filePath to the reducers', () => {
      this.state.dispatch({ type: FILE_UNLINK, filePath: '/test/configs/withGQL/gql/RunQueryOne.js' })
      const entityDispatch = this.dispatchLog.find(disp => disp.type === ENTITY_UNLINK)
      expect(entityDispatch).toBeDefined()
      expect(entityDispatch.filePath).toBeDefined()
    })
  })
})
