module.exports = {
  handlers: [
    {
      path: '/nested/twice/zip',
      method: 'GET',
      mode: 'deepMerge',
      payload: {
        fixture: 'added'
      }
    }
  ]
}
