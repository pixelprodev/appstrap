module.exports = function () {
  return {
    files: [
      { pattern: 'index.js' },
      { pattern: 'lib/**/*.js' },
      { pattern: 'test/configs/**/*', instrument: false },
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
    }
  }
}
