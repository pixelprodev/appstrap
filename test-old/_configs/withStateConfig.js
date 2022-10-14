module.exports = {
  initialState: {
    foo: 'zoo',
    bar: 'bang',
    baz: 'zip'
  },
  routes: [
    {
      path: 'echo-state',
      get: (req, res, next, state) => { res.json(state) }
    },
    {
      path: 'update-state',
      post: (req, res, next, state) => { state.zip = 'zap'; res.sendStatus(200) }
    }
  ]
}