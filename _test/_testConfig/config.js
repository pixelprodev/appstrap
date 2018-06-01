module.exports = {
  assets: [],
  endpoints: [
    {
      path: '/',
      get: (req, res) => res.json({message: 'this is the root'})
    },
    {
      path: 'updated-14',
      get: (req, res) => res.send('ok')
    },
    {
      path: '/test',
      get: (req, res) => res.json({test: 'updated 456'}),
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
