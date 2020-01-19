const Appstrap = require('../../')

exports = module.exports = function strapDefault () {
  return new Appstrap({ config: './test/_configs/defaultConfig.js' })
}
