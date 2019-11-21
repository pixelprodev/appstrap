module.exports = {
  routes: [
    {
      path: 'foo',
      get: {
        pog: 'u'
      }
    },
    {
      path: 'bar',
      mode: 'replace',
      post: {
        fixture: true
      }
    }
  ]
}