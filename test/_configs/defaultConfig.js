module.exports = {
  statics: [
    { web: 'images', local: './assets' }
  ],
  routes: [
    { path: 'foo', get: (req, res) => res.send('foo route intercepted') },
    { path: 'bar', post: (req, res) => res.send('bar route intercepted') },
    { path: 'state-echo', get: (req, res, next, state) => res.json(state) },
    { path: 'fixture-intercept', get: (req, res) => res.json({ default: true }) }
  ]
}
