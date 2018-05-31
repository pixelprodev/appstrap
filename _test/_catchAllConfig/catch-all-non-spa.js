module.exports = {
  assets: [],
  endpoints: [
    {
      path: '*',
      get: (req, res) => res.send('ok')
    }
  ]
}
