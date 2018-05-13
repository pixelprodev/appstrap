module.exports = [
  {
    path: '/',
    mode: 'replace',
    get: {
      foo: 'bar',
      bar: 'baz'
    }
  },
  {
    path: '/bar',
    mode: 'merge',
    get: {
      zip: 'zam'
    }
  }
]
