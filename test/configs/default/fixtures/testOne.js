module.exports = {
  handlers: [
    {
      path: '/foo',
      method: 'GET',
      mode: 'mergeDeep',
      payload: {
        bar: 'baz'
      }
    }
  ]
}
