module.exports = {
  assets: [],
  endpoints: [
    {
      path: '/',
      get: (req, res) => res.send('this is the root')
    },
    {
      path: '/test',
      get: (req, res) => res.json({test: 'test'}),
      post: (req, res) => res.sendStatus(200)
    },
    {
      path: '/test/:param',
      get: (req, res) => res.json({param: req.params.param}),
      delete: (req, res) => res.sendStatus(200)
    },
    {
      path: '/foo',
      post: (req, res) => res.sendStatus(200),
      patch: (req, res) => res.sendStatus(200),
      put: (req, res) => res.sendStatus(200)
    },
    {
      path: '/bar',
      get: (req, res) => res.json({bar: 'bar'})
    }
  ]
}
