module.exports = {
  assets: [],
  endpoints: [
    { path: '/foo', get: (req, res) => res.send('foo route intercepted') }
  ]
}
