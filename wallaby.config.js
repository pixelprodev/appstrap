module.exports = function () {
  return {
    files: [
      { pattern: 'index.js' },
      { pattern: '.appstrap/**/*.js' },
      { pattern: 'lib/**/*.js' },
      { pattern: 'adapters/**/*.js' },
      { pattern: 'test/_configs/assets/*.png', instrument: false },
      { pattern: 'test/**/*.js' },
      { pattern: 'test/**/*.spec.js', ignore: true }
    ],
    tests: [
      { pattern: 'test/**/*.spec.js' }
    ],
    testFramework: 'mocha',
    env: {
      type: 'node',
      runner: 'node',
      params: {
        env: 'NODE_ENV=test'
      }
    },
    setup: function () {
      global.expect = require('expect')
    }
  }
}
