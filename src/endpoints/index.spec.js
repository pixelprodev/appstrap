import { Endpoints } from './index'

xdescribe('Endpoints', () => {
  describe('addOne()', () => {
    test('Adds a new endpoint to the internal array', () => {
      const collection = new Endpoints()
      expect(collection.fetch().length).toEqual(0)
      collection.addOne({path: '/', method: 'get', handler: () => {}})
      expect(collection.fetch().length).toEqual(1)
      collection.addOne({path: '/', method: 'post', handler: () => {}})
      expect(collection.fetch().length).toEqual(2)
    })
  })
  describe('clear()', () => {
    test('Clears all endpoints from the internal array', () => {
      const collection = new Endpoints()
      expect(collection.fetch().length).toEqual(0)
      collection.addOne({path: '/', method: 'get', handler: () => {}})
      expect(collection.fetch().length).toEqual(1)
      collection.addOne({path: '/', method: 'post', handler: () => {}})
      expect(collection.fetch().length).toEqual(2)

      collection.clear()
      expect(collection.fetch().length).toEqual(0)
    })
  })
  describe('setModifier()', () => {
    test('updates error code for a specific endpoint', () => {
      const collection = new Endpoints()
      collection.addOne({path: '/', method: 'get', handler: () => {}})
      collection.setModifier({path: '/', method: 'get', errorCode: 500})
      const updatedModifiers = collection.fetch({path: '/', method: 'get'})
      expect(updatedModifiers.errorCode).toBe(500)
    })
    test('updates error toggle for a specific endpoint', () => {
      const collection = new Endpoints()
      collection.addOne({path: '/', method: 'get', handler: () => {}})
      collection.setModifier({path: '/', method: 'get', error: true})
      const updatedModifiers = collection.fetch({path: '/', method: 'get'})
      expect(updatedModifiers.error).toBe(true)
    })
    test('updates error with code for a specific endpoint', () => {
      const collection = new Endpoints()
      collection.addOne({path: '/', method: 'get', handler: () => {}})
      collection.setModifier({path: '/', method: 'get', error: true, errorCode: 500})
      const updatedModifiers = collection.fetch({path: '/', method: 'get'})
      expect(updatedModifiers.error).toBe(true)
      expect(updatedModifiers.errorCode).toBe(500)
    })
    test('updates latency ms for a specific endpoint', () => {
      const collection = new Endpoints()
      collection.addOne({path: '/', method: 'get', handler: () => {}})
      collection.setModifier({path: '/', method: 'get', latencyMS: 3000})
      const updatedModifiers = collection.fetch({path: '/', method: 'get'})
      expect(updatedModifiers.latencyMS).toBe(3000)
    })
    test('updates latency toggle for a specific endpoint', () => {
      const collection = new Endpoints()
      collection.addOne({path: '/', method: 'get', handler: () => {}})
      collection.setModifier({path: '/', method: 'get', latency: true})
      const updatedModifiers = collection.fetch({path: '/', method: 'get'})
      expect(updatedModifiers.latency).toBe(true)
    })
    test('updates latency with ms for a specific endpoint', () => {
      const collection = new Endpoints()
      collection.addOne({path: '/', method: 'get', handler: () => {}})
      collection.setModifier({path: '/', method: 'get', latency: true, latencyMS: 3000})
      const updatedModifiers = collection.fetch({path: '/', method: 'get'})
      expect(updatedModifiers.latency).toBe(true)
      expect(updatedModifiers.latencyMS).toBe(3000)
    })
  })

  describe('clearModifier()', () => {
    test('resets all endpoint modifiers', () => {
      const collection = new Endpoints()
      collection.addOne({path: '/', method: 'get', handler: () => {}})
      collection.setModifier({path: '/', method: 'get', latency: true, latencyMS: 3000})
      let modifiers = collection.fetch({path: '/', method: 'get'})
      expect(modifiers.latency).toBe(true)
      expect(modifiers.latencyMS).toBe(3000)

      collection.clearModifier({path: '/', method: 'get'})
      modifiers = collection.fetch({path: '/', method: 'get'})
      // defaults
      expect(modifiers.error).toBe(false)
      expect(modifiers.errorCode).toBe(undefined)
      expect(modifiers.latency).toBe(false)
      expect(modifiers.latencyMS).toBe(0)
    })
  })
})
