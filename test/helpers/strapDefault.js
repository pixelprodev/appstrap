const Appstrap = require('../../lib/Appstrap')
const testLogger = require('./TestLogger')

exports = module.exports = function strapDefault () {
  return new Appstrap({ repository: 'test/configs/default', logger: testLogger })
}
