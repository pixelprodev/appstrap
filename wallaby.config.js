module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'src/**/*.js'},
      {pattern: '!src/management-interface/src/**/*'},
      {pattern: '_test/**/*.js'},
      {pattern: './webpack-dynamic-require.js'},
      {pattern: '_test/**/config.js', instrument: false, load: false},
      {pattern: 'src/**/*.spec.js', ignore: true},
      {pattern: '_test/**/*.spec.js', ignore: true}
    ],
    tests: [
      {pattern: 'src/**/*.spec.js'},
      {pattern: '_test/**/*.spec.js'}
    ],
    testFramework: 'jest',
    env: {
      type: 'node',
      runner: 'node'
    },
    filesWithNoCoverageCalculated: [
      'src/cli.js',
      '_test/**/*.js'
    ],
    compilers: {
      'src/**/*.js': wallaby.compilers.babel(),
      '_test/**/*.js': wallaby.compilers.babel()
    }
  }
}
