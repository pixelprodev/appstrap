const { spy } = require('sinon')

exports = module.exports = {
  info: spy(),
  trace: spy(),
  warn: spy(),
  error: spy()
}
