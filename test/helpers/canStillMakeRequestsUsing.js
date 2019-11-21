const express = require('express')
const request = require('supertest')
const app = express()

app.get('/test', (req, res) => {
  res.send('standard route hit').status(200)
})

exports = module.exports = async function useStrapAsMiddleware (strap) {
  app.use(strap)
  const response = await request(app).get('/test')
  expect(response.status).toEqual(200)
  expect(response.text).toEqual('standard route hit')
  return true
}
