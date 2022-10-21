const Appstrap = require('../../lib/Appstrap')
const testLogger = require('./TestLogger')

exports = module.exports = function strapDefault () {
  return new Appstrap({ configDir: './test/configs/default', logger: testLogger })
}
