module.exports = function () {
  return {
    files: [
      { pattern: 'src/**/*.js' },
      { pattern: 'src/**/*.spec.js', ignore: true }
    ],
    tests: [
      { pattern: 'src/**/*.spec.js' }
    ],
    testFramework: 'mocha',
    env: {
      type: 'node',
      runner: 'node'
    },
    filesWithNoCoverageCalculated: [
      'src/cli.js'
    ],
    setup: function (wallaby) {
      global.expect = require('expect')
      wallaby.testFramework.ui('tdd')
    }
  }
}
