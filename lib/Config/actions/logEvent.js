const logger = require('../../Logger')

function logEvent ({ type, msg }) {
  logger[type.toLowerCase()](msg)
}

module.exports = logEvent
