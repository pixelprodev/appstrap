module.exports = function () {
  return {
    files: [
      { pattern: 'src/**/*.js' },
      { pattern: 'src/**/*.spec.js', ignore: true }
    ],
    tests: [
      { pattern: 'src/**/*.spec.js' }
    ],
    testFramework: 'jest',
    env: {
      type: 'node',
      runner: 'node'
    },
    filesWithNoCoverageCalculated: [
      'src/cli.js'
    ]
  }
}
