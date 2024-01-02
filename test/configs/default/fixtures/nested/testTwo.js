module.exports = {
  handlers: [
    {
      path: '/nested/twice/zip',
      method: 'GET',
      mode: 'mergeDeep',
      payload: {
        fixture: 'added'
      }
    }
  ]
}
