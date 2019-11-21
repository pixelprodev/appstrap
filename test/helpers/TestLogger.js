const Logger = require('../../lib/Logger')
const { spy } = require('sinon')

module.exports = new Logger({
  info: spy(),
  trace: spy(),
  warn: spy(),
  error: spy()
})
