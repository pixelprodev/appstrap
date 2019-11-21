const path = require('path')

function normalizeRoutePathPrefix (routePath) {
  if (!routePath.startsWith(path.sep)) {
    routePath = `${path.sep}${routePath}`
  }
  return routePath
}

function normalizeWebRoutePathPrefix (webRoutePath) {
  if (!webRoutePath.startsWith('/')) {
    webRoutePath = `/${webRoutePath}`
  }
  return webRoutePath
}

function sleep (duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

exports = module.exports = {
  normalizeRoutePathPrefix,
  normalizeWebRoutePathPrefix,
  sleep
}
