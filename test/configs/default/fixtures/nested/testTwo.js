module.exports = {
  routes: [
    {
      path: '/nested/twice/zip',
      mode: 'deepMerge',
      get: {
        fixture: 'added'
      }
    }
  ]
}
