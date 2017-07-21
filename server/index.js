const express = require('express')
const app = express()

async function initialize(config, port) {
  const router = await loadRoutes(config)
  app.use(router)
  app.listen(port)
  console.log(`initializing with port: ${port}`)
}

//must return an express router instance
async function loadRoutes(config) {
  const routeBuilder = express.Router()

  config.routes.forEach(({endpoint, handlers}) => {
    handlers.forEach(({method, handler}) => {
      routeBuilder[method.toLowerCase()](endpoint, (req, res, next) => {
        // todo do checks for error or latency here
        return handler(req, res, next)
      })
    })
  })

  return routeBuilder
}



