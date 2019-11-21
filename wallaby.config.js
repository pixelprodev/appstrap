module.exports = function () {
  return {
    files: [
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
