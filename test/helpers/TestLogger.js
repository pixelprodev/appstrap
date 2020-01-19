const Logger = require('../../lib/Logger')
const { spy } = require('sinon')

exports = module.exports = new Logger({
  info: spy(),
  trace: spy(),
  warn: spy(),
  error: spy()
})
