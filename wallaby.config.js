module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'src/**/*.js'},
      {pattern: '_test/**/*.js'},
      {pattern: 'src/**/*.spec.js', ignore: true}
    ],
    tests: [
      {pattern: 'src/**/*.spec.js'}
    ],
    testFramework: 'jest',
    env: {
      type: 'node',
      runner: 'node'
    },
    filesWithNoCoverageCalculated: [
      'src/cli.js',
      '_test/**/config.js'
    ],
    compilers: {
      'src/**/*.js': wallaby.compilers.babel(),
      '_test/**/*.js': wallaby.compilers.babel()
    }
  }
}
