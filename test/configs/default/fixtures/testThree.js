module.exports = {
  handlers: [
    {
      path: '/foo',
      mode: 'merge',
      method: 'GET',
      payload: { bar: 'bingo', zip: 'zang' }
    }
  ]
}
