module.exports = {
  bundle: {webPath: '/foo', host: '#bar'},
  assets: [],
  endpoints: [
    {
      path: '*',
      get: (req, res) => res.send('ok')
    }
  ]
}
