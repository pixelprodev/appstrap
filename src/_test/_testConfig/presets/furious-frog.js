module.exports = [
  {
    path: '/',
    mode: 'merge',
    get: {
      foo: 'two',
      bar: 'zub'
    }
  },
  {
    path: '/Test',
    mode: 'replace',
    get: {
      case: 'insensitive'
    }
  }
]
