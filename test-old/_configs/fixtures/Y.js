module.exports = {
  routes: [
    { path: 'fixture-intercept', mode: 'mergeDeep', get: { y: { deep: true } } }
  ]
}
