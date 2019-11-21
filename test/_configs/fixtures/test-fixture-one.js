module.exports = {
  routes: [
    {
      path: 'fixture-intercept',
      mode: 'replace',
      get: {
        intercepted: true
      }
    }
  ]
}
